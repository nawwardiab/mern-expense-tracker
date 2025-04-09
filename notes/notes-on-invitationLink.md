1. **The invite link should** redirect to a page where the user can accept or join the group **manually** (i.e., the user sees a confirmation screen, not auto-join).
2. **Only the group creator** can generate an invite link.
3. The invite link is **for registered users** only; if the user is not registered, they’ll be prompted to sign up.
4. The link **expires after a certain time**.
5. Regarding **tracking who generated the invite**: in most real-world apps, we do store who generated it (the group creator in our case). This helps with auditing, troubleshooting, or restricting link privileges. But it's optional if we don’t need that data.

---

## 1. High-Level Flow

1. **Creator clicks “Generate Invite Link.”**

   - The server creates a unique `inviteToken` and an **Invite** record in the database.
   - The response includes a URL (e.g., `http://localhost:5317/invite/<inviteToken>`).

2. **Creator shares the link** with potential group members.

3. **Recipient clicks the link** and is directed to a dedicated page:

   - If **not logged in**, the user is prompted to log in or sign up.
     - After successful login/signup, they are redirected back to the **invite accept page**.
   - If **already logged in**, they directly see a “Join Group?” prompt (maybe showing group details).

4. **User accepts the invite**:

   - The server validates `inviteToken`, checks it’s not expired, ensures group still exists, etc.
   - If valid, the user is added to the group.

5. **allow multiple uses** until it expires.

---

## 2. Database & Models

### 2.1. **Invite** Model (New)

Create a new (sub-)collection for invites:

```js
import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Invite", inviteSchema);
```

Key fields:

- **`token`**: A random string or UUID that identifies the invite.
- **`group`**: Reference to the specific group being joined.
- **`createdBy`**: The user (group creator) who generated the link.
- **`expiresAt`**: Datetime for automatic expiration.

---

## 3. Generating the Invite Link

### 3.1. **Random Token Generation**

Generate a random token using Node’s built-in `crypto` module or a package like `uuid`:

```js
import crypto from "crypto";
// or import { v4 as uuidv4 } from 'uuid';

function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
  // or return uuidv4();
}
```

### 3.2. **Controller: `POST /groups/:groupId/invite`**

- **Check** that the request is made by the group `createdBy`.
- **Generate** the token.
- **Save** a new `Invite` document to MongoDB with:
  - `token`
  - `group: groupId`
  - `createdBy: req.user._id`
  - `expiresAt: Date.now() + someDuration`

```js
export const createInviteLink = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only group creator can generate links
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const token = generateInviteToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week example

    const inviteDoc = new Invite({
      token,
      group: group._id,
      createdBy: req.user._id,
      expiresAt,
    });

    await inviteDoc.save();

    const inviteURL = `http://localhost:5317/invite/${token}`;

    res.status(201).json({
      inviteURL,
      expiresAt,
      message: "Invite link created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
```

---

## 4. Handling the Invite Link on the Frontend

### 4.1. **Frontend Flow**

1. **Group creator** clicks “Generate Invite Link” button.
2. **AJAX call** to `POST /groups/:groupId/invite`.
3. **Receive** the invite link in JSON. Possibly show a modal with the link or copy to clipboard.

Example React code snippet:

```js
const handleGenerateInvite = async () => {
  try {
    const res = await axios.post(`/groups/${groupId}/invite`);
    // e.g. { inviteURL: "...", expiresAt: "...", message: "..."}
    setInviteLink(res.data.inviteURL);
  } catch (error) {
    console.error("Error generating invite:", error);
  }
};
```

### 4.2. **Dedicated Invite Page** `/invite/:token`

1. **User arrives** at `/invite/<token>`.
2. The component/modal calls `GET /invite/:token/validate` to see if the invite is valid, expired, etc.
3. If **not logged in**, user is redirected to sign in/up. After sign in, user is brought back here.
4. If **valid** and **user is logged in**, show a **Join Group?** button.
5. Clicking it calls `PATCH /invite/:token/accept`. The server checks validity again and if valid, adds user to the group.

---

## 5. Validating & Accepting the Invite

### 5.1. **GET /invite/:token/validate**

```js
export const validateInviteToken = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token }).populate("group");

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    // Check expiration
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite link has expired" });
    }

    return res.status(200).json({
      message: "Invite is valid",
      group: {
        _id: invite.group._id,
        name: invite.group.name,
        description: invite.group.description,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
```

### 5.2. **PATCH /invite/:token/accept**

```js
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    // Must be logged in to accept
    if (!req.user) {
      return res.status(401).json({ message: "Please log in first" });
    }

    const invite = await Invite.findOne({ token }).populate("group");

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite link has expired" });
    }

    // Check if user is already a member
    const isAlreadyMember = invite.group.members.some(
      (member) => member.userId.toString() === req.user._id.toString()
    );

    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this group" });
    }

    // Add user to group
    invite.group.members.push({ userId: req.user._id });
    await invite.group.save();

    return res.status(200).json({
      message: "You have joined the group successfully",
      groupId: invite.group._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
```

---

## 6. Auth Flow for Non-Registered Users

> If not registered, the user should trigger the sign-up form.

**Approach**:

1. When a not-logged-in user visits `/invite/:token`, store the token in local/session storage or a React state.
2. Redirect to **SignUp** or **SignIn** page.
3. After successful login/signup, redirect them back to `/invite/:token`.
4. The user can now accept the invite.

This ensures only registered (and now logged-in) users can accept the invite.

---

## 7. Pros & Cons of a Dedicated Invite Page

### 7.1. **Dedicated Route**: `/invite/:token`

**Pros**:

- Clear user flow: “You’ve been invited to join Group X. Accept or Decline?”
- Easy to handle token-based logic: we can do our checks in `useEffect` and conditionally render UI.
- Great for redirects if user isn’t logged in yet.

**Cons**:

- Requires extra code (components/routes) to handle invites in the frontend.

### 7.2. **Alternative**: Directly handle join logic in the backend on “open link”

- **Pros**: Fewer steps for the user. Possibly an auto-join if that’s desired.
- **Cons**: Less secure (they might accidentally join without wanting to), and user cannot see group info or confirm before joining.

**Best Practice**: Usually a dedicated route is simpler and more user-friendly.

---

## 8. Additional Considerations

1. **Expiration**:

   - Set `expiresAt = Date.now() + 7 days`.
   - Could be shorter or configurable by the user.

2. **Single-use vs multi-use**:

   - For single-use, mark `invite.used = true`.
   - For multi-use, skip that logic and simply let multiple people join with the same link until it expires.

3. **Security**:

   - The token should be random or a UUID.
   - Storing it in plain text in the `Invite` doc is fine if it’s purely ephemeral. _May_ also hash it for extra security.

4. **Auditing**:

   - Keep `createdBy` for who generated the link.
   - Possibly store `acceptedBy` or a history if we want a record of every user who used that link.

5. **Revoking** invites:

   - The group creator might want to revoke an unused link.
   - That means setting `invite.expiresAt = Date.now()` or `invite.used = true` so it can’t be used.

6. **Notification**:
   - If the group is private, maybe automatically notify the group creator whenever a new member joins.

---

## Final Summary

1. **Add an `Invite` model** with fields: `token`, `group`, `createdBy`, `expiresAt`, `used`.
2. **Generate** invites via a route:
   - Validate the user is the group creator.
   - Create a random token, store it in the DB with an expiration date.
3. **Serve the invite link** to the frontend, which the creator shares.
4. **Use a dedicated route** `/invite/:token` to handle:
   - Checking validity/expiration
   - Checking if user is logged in
   - Letting user confirm they want to join
5. **Accept** the invite via a separate route (or the same route with a `POST`) that:
   - Validates it’s still valid
   - Adds the user to the group
   - Marks the invite as used (if single-use)

This approach is the most **straightforward** and **secure** while giving a good user experience.

**Next Steps**:

- Implement the invite endpoints (`createInviteLink`, `validateInviteToken`, `acceptInvite`).
- Create a React page or modal for `/invite/:token`.
- Integrate with existing login flow to handle the “not logged in => sign up => come back” scenario.
