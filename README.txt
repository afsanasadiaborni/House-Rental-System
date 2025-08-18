HOW TO RUN (Front-end in Chrome)
---------------------------------
1) Download and extract the ZIP.
2) Open the folder and double-click `index.html` to open it in Google Chrome.
   - All data is stored in your browser's localStorage.
   - Use the navbar to switch between: Dashboard, Apartments, Landlord, Tenants, Rent.
   - Click "Reset Demo Data" anytime to reload the example (Mirpur 1/2/3; Apt 101/102/103).

OPTIONAL: RUN THE C++ DEMO (Console)
------------------------------------
1) Requirements: a C++17 compiler (e.g., g++, clang++).
2) Open a terminal in the `cpp` folder and run:
   g++ -std=c++17 rental_system.cpp -o rental
   ./rental    (Linux/Mac)   or   rental.exe (Windows)
3) The C++ app prints the same dashboard, tenants list, and payments to the console.

FILES
-----
- index.html  : Single-page app UI with Bootstrap
- styles.css  : Minimal custom styles
- app.js      : Logic + localStorage CRUD
- assets/*.svg: Placeholder apartment images (2-room and 3-room)
- cpp/rental_system.cpp : Simple console-based model
