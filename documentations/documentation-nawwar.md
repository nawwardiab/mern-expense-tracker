## 05.03.2025

---

## 06.03.2025

---

## 10.03.2025

---

## 11.03.2025

---

## 12.03.2025

---

## 13.03.2025

---

## 17.03.2025

---

## 18.03.2025

---

## 19.03.2025

---

## 20.03.2025

---

## 24.03.2025

---

## 25.03.2025

---

## 26.03.2025

---

## 27.03.2025

---

## 31.03.2025

---

## 01.04.2025

---

## 02.04.2025

---

## 03.04.2025

---

## 07.04.2025

- Create `Invite.js` Schema.
- Install `uuid` dependency
- Create `generateInviteToken()` inside `utils/generateInviteToken.js` to generate unique invitation token
- Create `inviteController.js` with `createInviteLink()`, `validateInviteToken()`, `acceptInvite()`
- Create `inviteRouter` and routed creation, validation and acceptance route/controller.
- test using http rest client.

---

## 08.04.2025

- Create `InviteContext.jsx` + `inviteReducer.js`
- Add `InviteProvider` in `main.jsx`
- Create `inviteApi.js` and `generateInviteLink()`
- Add `Invite Friends` button in `GroupDetail.jsx`
- Create `InviteModal.jsx`. Creator can copy invitation link
- Create `validateInvite()` & `acceptInvite()` Api call.
- Update `inviteReducer.js`
-

## 09.04.2025

- Update `GroupList.jsx` to render latest group first in the list.
- Create `createInviteByEmail()` in the `inviteApi.js`
- Install `nodemailer` dependency in Backend
- Create `inviteByMail()` controller
- Add `sendInvitationEmail.js` middleware
- Add `/:groupId/email` endpoint in the `inviteRouter.js`
- Call `createInviteByEmail()` in the `inviteModal.jsx`
- Add `Email Input` + `send email button` in `inviteModal.jsx`
- Update `inviteReducer.js` with Email Invitation actions

---

## 10.04.2025

**Workflow**:

- a user creates a group
- creator invites members
- members add expenses they paid
- the expenses are added to the total group expense
- the amount is splitted upon members
- members who already paid expenses only pay the difference between their paid amount and to-be-paid amount
- if member paid expense higher than their to-be-paid, they become payee (with the diference)
- this should be all managed and shown inside the group event

-
