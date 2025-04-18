| table_name    | column_name             | data_type                |
| ------------- | ----------------------- | ------------------------ |
| Children      | id                      | uuid                     |
| InjuryReports | reviewed_by_user_id     | uuid                     |
| InjuryReports | reviewed_timestamp      | timestamp with time zone |
| InjuryReports | is_delivered_to_parent  | boolean                  |
| InjuryReports | delivered_by_user_id    | uuid                     |
| InjuryReports | delivered_timestamp     | timestamp with time zone |
| InjuryReports | created_at              | timestamp with time zone |
| InjuryReports | updated_at              | timestamp with time zone |
| InjuryReports | ai_validated            | boolean                  |
| InjuryReports | ai_suggestions_count    | integer                  |
| InjuryReports | ai_suggestions_accepted | integer                  |
| Children      | created_at              | timestamp with time zone |
| Children      | updated_at              | timestamp with time zone |
| Users         | id                      | uuid                     |
| Users         | created_at              | timestamp with time zone |
| Users         | updated_at              | timestamp with time zone |
| InjuryReports | id                      | uuid                     |
| InjuryReports | child_id                | uuid                     |
| InjuryReports | submitting_user_id      | uuid                     |
| InjuryReports | injury_timestamp        | timestamp with time zone |
| InjuryReports | is_bite                 | boolean                  |
| InjuryReports | biter_child_id          | uuid                     |
| InjuryReports | is_peer_aggression      | boolean                  |
| InjuryReports | aggressor_child_id      | uuid                     |
| InjuryReports | is_reviewed             | boolean                  |
| Children      | name                    | text                     |
| InjuryReports | memo_content            | text                     |
| InjuryReports | parent_narrative        | text                     |
| InjuryReports | location                | text                     |
| Users         | name                    | text                     |
| Users         | role                    | text                     |
| InjuryReports | incident_description    | text                     |
| InjuryReports | injury_description      | text                     |
| InjuryReports | action_taken            | text                     |
| InjuryReports | injury_time_eastern     | text                     |