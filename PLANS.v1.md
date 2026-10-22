# PLANS.v1 — Initial AI draft

This is the preserved first draft for review, as required by the homework. The final plan is maintained in `PLANS.md`.

| Step | Work | VERIFY cases |
| --- | --- | --- |
| 0 | Set up the static site, test runner, bounded island, first-person movement, and collision. | STEP 0 |
| 1 | Add hold-to-mine timing and reset progress on release. | STEP 1 |
| 2 | Spawn a same-type drop and settle it on the island. | STEP 2 |
| 3 | Collect drops within range and update the matching inventory count. | STEP 3 |
| 4 | Place the selected block on a valid face and update inventory. | STEP 4 |
| 5 | Add toggleable rain with visible falling drops and roof shelter. | STEP 5 |
| 6 | Add a repeating day/night lighting cycle. | STEP 6 |

## Initial review notes

- Each teacher-provided first-batch step has a corresponding implementation step.
- The student selected rain with roof shelter and a day/night cycle. Their acceptance cases are recorded in `VERIFY.md`.
- This project begins without a test runner or implementation, so Step 0 includes the test setup.
