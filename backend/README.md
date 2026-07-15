# Insurance Underwriting System — Backend (Spring Boot)

Capstone project backend. Java 17 + Spring Boot 3 + Spring Security (JWT) + Spring Data JPA + PostgreSQL.

Supports 4 insurance types: **LIFE, HEALTH, MOTOR, HOME** with a rules-based
underwriting engine that scores risk (0-100), decides
APPROVED / REFERRED / REJECTED, and calculates premium.

---

## 1. Prerequisites (already installed on your machine)

- Java 17
- Maven 3.9+
- PostgreSQL running on localhost:5432 (user: `postgres`, password: `root`)
- Eclipse IDE (Spring Tools 4 plugin recommended but not required)

## 2. Create the database (one-time)

Open **pgAdmin** (or psql) and run:

```sql
CREATE DATABASE insurance_db;
```

That's it — Hibernate creates the tables automatically on first run.

## 3. Import the project into Eclipse

1. Unzip `ius-backend.zip` somewhere, e.g. `D:\capstone\ius-backend`.
2. Open Eclipse.
3. **File → Import… → Maven → Existing Maven Projects → Next**.
4. Browse to the unzipped `ius-backend` folder → **Finish**.
5. Wait for Maven to download dependencies (bottom-right progress bar). First
   time can take 3–5 minutes.
6. If you see red errors about **Lombok**:
   - Download `lombok.jar` from https://projectlombok.org/download
   - Run it: `java -jar lombok.jar` → point it to your Eclipse install → Install/Update → restart Eclipse.
7. Right-click project → **Maven → Update Project… → OK**.

## 4. Run the app

**Option A — from Eclipse:**
- Right-click `InsuranceUnderwritingApplication.java` (in `com.capstone.ius`)
  → **Run As → Java Application**.

**Option B — from terminal in the project folder:**
```bash
mvn spring-boot:run
```

You should see:
```
Tomcat started on port 8080
Started InsuranceUnderwritingApplication in X.XXX seconds
```

Tables are auto-created in `insurance_db`. Verify in pgAdmin: you should see
`users` and `policy_applications` tables.

## 5. Test the APIs (use Postman or the frontend later)

Base URL: `http://localhost:8080`

### Register a customer
`POST /api/auth/register`
```json
{
  "username": "john",
  "email": "john@test.com",
  "password": "john123",
  "fullName": "John Doe",
  "phone": "9876543210"
}
```
Returns a JWT `token`. Send it as `Authorization: Bearer <token>` on all
other endpoints.

### Register an admin
Same endpoint, add `"role": "ADMIN"` in the JSON.

### Login
`POST /api/auth/login`
```json
{ "username": "john", "password": "john123" }
```

### Submit a policy application (customer)
`POST /api/applications`  (Bearer token required)
```json
{
  "insuranceType": "LIFE",
  "age": 32,
  "gender": "MALE",
  "occupation": "Software Engineer",
  "annualIncome": 900000,
  "coverageAmount": 5000000,
  "termYears": 20,
  "smoker": false,
  "alcoholUser": false,
  "preExistingDisease": "NONE"
}
```

Other insurance-type examples:

**HEALTH**
```json
{
  "insuranceType": "HEALTH",
  "age": 40, "gender": "FEMALE",
  "annualIncome": 700000, "coverageAmount": 500000, "termYears": 1,
  "heightCm": 165, "weightKg": 78,
  "smoker": false, "familyHistory": true, "preExistingDisease": "DIABETES"
}
```

**MOTOR**
```json
{
  "insuranceType": "MOTOR",
  "age": 28, "gender": "MALE",
  "annualIncome": 600000, "coverageAmount": 800000, "termYears": 1,
  "vehicleType": "CAR", "vehicleAge": 3, "vehicleValue": 800000, "pastClaims": 0
}
```

**HOME**
```json
{
  "insuranceType": "HOME",
  "age": 45, "gender": "MALE",
  "annualIncome": 1200000, "coverageAmount": 3000000, "termYears": 5,
  "propertyType": "APARTMENT", "propertyAge": 8,
  "propertyValue": 4000000, "propertyLocation": "LOW_RISK"
}
```

### Get my applications
`GET /api/applications/my`

### Live quote (no save)
`POST /api/applications/quote` (same body as submit)

### Admin – list all applications
`GET /api/admin/applications`  (login as ADMIN)

### Admin – override decision
`PUT /api/admin/applications/{id}/decision`
```json
{ "status": "APPROVED", "remarks": "Verified documents" }
```

---

## 6. Project structure

```
src/main/java/com/capstone/ius
 ├─ InsuranceUnderwritingApplication.java   (main class)
 ├─ config/SecurityConfig.java
 ├─ controller/                             (REST endpoints)
 ├─ dto/                                    (request/response objects)
 ├─ entity/                                 (JPA entities: User, PolicyApplication)
 ├─ exception/                              (global error handler)
 ├─ repository/                             (Spring Data JPA)
 ├─ security/                               (JWT util + filter)
 ├─ service/                                (business logic)
 └─ underwriting/UnderwritingEngine.java    (risk scoring + premium)
```

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `password authentication failed` | Change `spring.datasource.password` in `application.properties` |
| Port 8080 busy | Change `server.port` in `application.properties` |
| Lombok errors in Eclipse | Install lombok.jar into Eclipse (see step 3.6) |
| `database "insurance_db" does not exist` | Run `CREATE DATABASE insurance_db;` in pgAdmin |
| Tables not created | Make sure `spring.jpa.hibernate.ddl-auto=update` in `application.properties` |

---

Once the backend runs and you can register + submit an application from
Postman, you're ready for the **Angular frontend** — ping me for Part 2.
