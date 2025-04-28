## **1. Overall Goals for Week 4**

1. **Groups Management**

   - Create groups (with name/description).
   - Add/remove members from groups.
   - List groups and their associated expenses.

2. **Expenses & Payments**

   - Record expenses within a group.
   - Split expenses among group members.
   - Create a payment (to settle up an expense or part of it).
   - Update payment status (e.g., pending, completed).

3. **Frontend UIs**

   - “GroupExpense” page(s) to list groups, show group details/expenses.
   - Payment module UI: listing payments, marking them as paid, partial payments, etc.
   - Forms to create groups, invite members, and handle expense/payout flows.

4. **Testing & Integration**
   - End-to-end testing of group creation through expense settlement.
   - Backend tests for group and payment logic.
   - Frontend tests for UI flows (basic component or integration testing).

---

## **2. Key Deliverables By End of Week 4**

1. **Backend**:

   - Group routes (create, get, update, remove members).
   - Payment routes (create, list, update).
   - Logic for linking payments to groups/users.

2. **Frontend**:

   - Pages to view groups, group expenses, payment flows.
   - UI for creating groups and adding members.
   - UI for listing and updating payments.

3. **Integration & QA**:
   - Basic end-to-end workflow: Create group → Add expenses → Split costs → Create payment → Mark payment as completed.

---

## **3. Detailed Tasks and Assignments**

### **Developer A** (Backend: Group Management & Code Review)

1. **Group Routes**

   - **`POST /groups/create`**

     - **Subtasks**  
       a) Accept group name, description, and initial member list in request body.  
       b) Validate input (e.g., no empty group names).  
       c) Insert new group record into database.  
       d) Insert group membership records for each member.
     - **Dependencies**
       - Database schema for groups and group-members must be defined (Week 3 schema might be extended).
     - **Acceptance Criteria**
       - Sending valid data creates a new group and returns group details (groupId, members).
       - Handling of error cases (invalid data, duplicate group name if relevant).

   - **`GET /groups/:groupId/expenses`**

     - **Subtasks**  
       a) Validate groupId parameter.  
       b) Query the database for all expenses linked to the given group.  
       c) Return a list of expenses (amount, description, who paid, date, etc.).
     - **Dependencies**
       - Expense schema must be in place; either from earlier weeks or newly created.
     - **Acceptance Criteria**
       - Responds with an array of expense objects for the group, or empty array if none found.
       - Proper error handling if groupId not found or invalid.

   - **Group Member Management** (remove members, edit group info)
     - **Subtasks**  
       a) Possibly a `DELETE /groups/:groupId/members/:memberId` for removing members.  
       b) Possibly a `PATCH /groups/:groupId` for editing group name/description.
     - **Acceptance Criteria**
       - Members can be removed only if they have no outstanding balance, or partial logic to handle leftover balances.
       - Proper checks for group ownership or admin privileges (if relevant).

2. **Code Review & Merge Maintenance**
   - **Subtasks**  
     a) Maintain code quality standards through PR reviews.  
     b) Ensure consistent naming conventions and documentation in code.
   - **Acceptance Criteria**
     - No major syntax or style violations.
     - Merges do not break existing tests.

### **Developer B** (Backend: Payment Logic)

1. **Payment Routes** (`/payments`)

   - **`POST /payments/create`**

     - **Subtasks**  
       a) Accept payment info: amount, groupId or userId, expense reference, etc.  
       b) Validate the request (ensure expense and group exist, etc.).  
       c) Create payment record with status = "pending" by default.  
       d) Possibly store who is paying who (payer vs. payee).
     - **Dependencies**
       - Expense and group data from Developer A’s endpoints.
       - Database table for payments must be set up.
     - **Acceptance Criteria**
       - Successfully creating a payment returns a 201 status with the new payment object.
       - Proper error handling if references (group, user, expense) do not exist.

   - **`GET /payments/`** (list payments)

     - **Subtasks**  
       a) Return all payments, or filtered by user/group if a query parameter is provided.  
       b) Might require pagination if the list gets large.
     - **Acceptance Criteria**
       - Responds with an array of payment objects.
       - Handles filters (e.g., `GET /payments?groupId=xyz`).

   - **`PATCH /payments/:paymentId`** (update payment status)
     - **Subtasks**  
       a) Update status to “completed” or “failed,” etc.  
       b) Validate status transitions.  
       c) Possibly store a transaction reference or timestamp.
     - **Acceptance Criteria**
       - Responds with updated payment object.
       - Correctly handles invalid paymentId.

2. **Payment-Balance Integration**
   - **Subtasks**  
     a) Ensure that when a payment is marked “completed,” relevant balances are updated for the group or user.  
     b) Potentially coordinate with Developer A’s group/expense logic to keep track of who owes what.
   - **Acceptance Criteria**
     - The system properly reflects that the payer’s debt is reduced.
     - No double-counting or missing updates.

### **Developer C** (Frontend: Groups & Partial Backend Support)

1. **“GroupExpense” Page UI**

   - **Subtasks**  
     a) Display a list of existing groups (fetched from `/groups`).  
     b) Show group expenses (fetched from `GET /groups/:groupId/expenses`).  
     c) Basic layout to list each expense (amount, who paid, etc.).
   - **Dependencies**
     - Backend routes from Developer A must be stable.
     - API endpoints documented for easy integration.
   - **Acceptance Criteria**
     - User can see all groups on the left (or in a list).
     - Clicking on a group shows its expenses.
     - If no expenses exist, show a “No expenses yet!” message.

2. **Create Group & Add Members UI**

   - **Subtasks**  
     a) A modal or separate page with a form (group name, description, initial members).  
     b) Possibly implement an “Add Member” or “Remove Member” button in group detail.  
     c) Input validation (must have at least 2 members?).
   - **Dependencies**
     - `POST /groups/create` from Developer A.
   - **Acceptance Criteria**
     - Submitting valid data creates a group and updates the UI.
     - Clear error messages on invalid input or server errors.

3. **Backend Assistance: Expense Calculation / Splits (if needed)**
   - **Subtasks**  
     a) Provide small helper functions to compute each user’s share for an expense.  
     b) Possibly implement these as part of the group or expense routes if needed.
   - **Acceptance Criteria**
     - Splits are computed correctly (e.g., even split among members).

### **Developer D** (Frontend: Payment UI & Testing)

1. **“Payment” Module UI**

   - **Subtasks**  
     a) View existing payments in a table.  
     b) Button or flow to mark a payment as “completed.”  
     c) Possibly a “Create Payment” form to input amount, user, group, or expense ID.
   - **Dependencies**
     - `GET /payments` and `PATCH /payments/:paymentId` from Developer B.
   - **Acceptance Criteria**
     - User-friendly interface to see all payments (status, amount, who owes whom).
     - Updating status triggers the correct patch request and UI refresh.

2. **Integrate Group Payment Flows** (Split Expense Modal)

   - **Subtasks**  
     a) If an expense is created, provide a quick way to “split expense” that triggers creation of payments or at least suggests them.  
     b) Display how each user’s share is determined.  
     c) Possibly auto-generate a payment or direct the user to the payment form.
   - **Dependencies**
     - This might require coordination with Developer A (group data) and Developer B (payment creation).
   - **Acceptance Criteria**
     - Users have a clear flow from seeing an expense to paying it off.
     - The created payment is reflected on the Payment UI.

3. **Testing & QA**
   - **Subtasks**  
     a) Conduct end-to-end tests for group creation → expense creation → payment creation → payment completion.  
     b) File bug reports or coordinate with A/B/C to fix issues.  
     c) Possibly write basic automated tests (frontend integration or Cypress tests).
   - **Acceptance Criteria**
     - All major user flows for groups & payments are tested at least once.
     - Document issues and track them to resolution before end of Week 4.

---

## **4. Proposed Timeline for Week 4**

| **Day**       | **Tasks**                                                                                                                                                                                                                                                                           | **Notes**                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Monday**    | - Developer A finalizes `POST /groups/create` and member management. <br/> - Developer B sets up `/payments/create` route and DB schema for payments. <br/> - Developer C starts on GroupExpense UI skeleton. <br/> - Developer D outlines Payment UI design.                       | Kick off with team meeting to ensure clarity on schema & endpoints. |
| **Tuesday**   | - Developer A adds `GET /groups/:groupId/expenses`. <br/> - Developer B implements `GET /payments` and `PATCH /payments/:paymentId`. <br/> - Developer C integrates “Group List” and “Group Detail” pages with real data. <br/> - Developer D builds Payment listing and update UI. | Mid-week check: sync up on data shaping & any DB changes.           |
| **Wednesday** | - Developer A polishes member removal/edit logic (if needed). <br/> - Developer B handles advanced payment logic (balance updates). <br/> - Developer C finalizes “Create Group” form, add members. <br/> - Developer D implements “Create Payment” and integrates with group flow. | Aim for functional prototypes by end of day.                        |
| **Thursday**  | - QA and integration: Developers A/B ensure group–payment referencing works. <br/> - Developer C adds any styling and user validation messages. <br/> - Developer D does end-to-end tests (create group → expense → payment).                                                       | Focus on bug fixes and refining the user experience.                |
| **Friday**    | - Final code review, merges, cleanup of any leftover tasks. <br/> - Developer D runs final regression tests. <br/> - Prepare short demo for the entire flow.                                                                                                                        | End-of-week deliverable: All essential features working.            |

---

## **5. Additional Recommendations**

1. **Schema & Data Modeling**

   - Ensure that the table structures for Groups, GroupMembers, Expenses, and Payments are fully defined.
   - Consider a pivot table for user–group membership.
   - For payments, store references (groupId, expenseId, payerId, payeeId) as needed.

2. **API Documentation**

   - Update API docs (using tools like Swagger/OpenAPI or a simple wiki) for all new endpoints.
   - Keep parameters, request body, and expected responses well-documented.

3. **Error Handling & Validation**

   - Validate required fields (group name, payment amount, etc.).
   - Return user-friendly messages from the backend.
   - On the frontend, ensure forms display clear error states.

4. **Testing Strategy**

   - **Backend**: Unit tests for group routes (create, retrieve, update) and payment routes (create, list, update).
   - **Frontend**: Basic component tests for forms & lists; integration tests for entire user flows.
   - **End-to-End**: Developer D ensures that the user can create a group, add an expense, create a payment, and mark it completed.

5. **Review & Continuous Integration**
   - Use pull requests and code reviews to maintain quality.
   - Merge frequently to avoid large conflicts at the end of the week.
   - If possible, set up a staging environment or local environment to test the entire flow daily.

---

### **Conclusion**
