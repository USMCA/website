# USMCA
Web app for the [United States Math Competition Association](usmath.org).

## For Users

### Terms
* **Admin**: An administrator of USMCA. The Admin has the privilege of declaring competitions and its directors. The directors then take over the administration of the competition.
* **Competition**: A single organization that runs contests, e.g. CMIMC.
* **Contest**: An event run by competitions, e.g. CMIMC 2017. A competition specifies a set of active contests and those are the only contests that can be modified. 
* **Test**: A collection of problems belonging to a contest. 
* **User**: A single person who carries out certain roles to contests. Users have various privileges with respect to competitions and contests:
  * **Director** (of a competition): Manages members of a competition. A Director is also a Czar.
  * **Member** (of a competition): Proposes problems to the active contests.
  * **Czar** (of a contest): Manages the problems of the contest (including claiming shared pool problems) and appoints Test Solvers. A Czar is also a Member and a Test Solver. 
  * **Test Solver** (of a contest): Accesses problems of the contest and verifies its problems.

| | Director |  Czar | Member |Test Solver | Anyone |
| - | - | - | - | - | - |
| Propose to a Contest | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | | |
| View/Verify Problems | :heavy_check_mark: | :heavy_check_mark: |  | :heavy_check_mark: | |
| Propose to Shared Pool | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| View Shared Pool | :heavy_check_mark: | :heavy_check_mark: | | | |

### Obtaining Privileges
* Becoming an Admin
  * Anyone can request an Admin to become an Admin
  * An Admin can invite anyone to become an Admin
* Becoming a Director
  * Anyone can request an Admin to start a competition and become its first Director or become the Director of a competition without (active) Directors
  * A Member can request a Director to become a Director
  * A Director can invite a Member to become a Director
* Becoming a Czar
  * A Member can request a Director to become a Czar
  * A Director can invite a Member to become a Czar
* Becoming a Member
  * Anyone can request a Director to become a Member
  * A Director can invite anyone to become a Member
* Becoming a Test Solver
  * Anyone can request a Czar to become a Test Solver
  * A Czar can invite anyone to become a Test Solver

### Leaving/Removing Privileges
Anyone can leave a privilege. 
* Removing an Admin
  * An Admin can remove another Admin
* Removing a Director
  * A Director can remove another Director
* Removing a Czar
  * A Director can remove a Czar
* Removing a Member
  * A Director can remove a Member
* Removing a Test Solver
  * A Czar can remove a Test Solver

### Problem Proposal and Sharing (Alex Katz, current implementation)
A member of a competition can propose problems to any of its active contests. Anyone can propose to the shared pool of problems. A problem in a contest (not necessarily active) that does not belong to a test can be released to the shared pool of problems at any time by its author. Problems belonging to a test of a contest (not necessarily active) cannot be released to the shared pool. Problems in the shared pool can be claimed by an active contest by one of its Czars, up to a contest quota. A claimed problem cannot be used by any other contest until the Czar who claimed it releases it back to the shared pool. A claimed problem cannot be unshared, but an unclaim shared problem can be unshared. 

#### Quota System
A contest can take problems from the shared pool as long as after taking a problem from the pool, the tests of the contest are not composed of more than 30% of shared problems. 

#### Issues
Hack around quota system by creating dummy tests with dummy problems to claim a lot from shared pool.

## For Developers

### Project Structure
This project runs a node server and a MongoDB database and serves a frontend based on React/Redux and Materialize. 

### Set Up

* Populate a `.env` in the root directory with the MongoDB url `DB_URL`, the server port `PORT`, and a JWT secret `JWT_SECRET`
* Install node packages with `npm install`
* Build the react source with `npm run watch` (`npm run build` for production)
* Start the server with `npm run dev` (`npm start` for production)
