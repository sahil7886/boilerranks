# boilerranks

Goals:
 - Allow users to easily access their %ile academic performance (rank) across classes they've taken in the past.
 - Allow users to view the toughest/easiest classes offered by Purdue, by Major/College/etc.

Interface:
 - User selects between 2 modes: single or overall
 - If single:
    - Input: Course code + Grade + Semester taken + Professor/Lecture
    - Output: approx %ile rank in that course that session
 - If overall:
    - Input: [Course code + Grade + Semester taken + Professor/Lecture] for as many courses as User wants to enter
    - Output: approx average %ile rank across all courses and sessions

TODO:
 - clean up user input for course code input and professor input
   - course code: auto caps all letters (cs182 -> CS182)
   - course code: remove spaces, if any (CS 182 -> CS182)
   - professor: interpreting name
      - should be Last Name, First Name
      - input might be different
      - ideally, implement dropdown including options based on course code and semester
 - yet to handle calculation for overall ranking
 - idea: generate stats page for either mode
   - single course:
      - "You were in the top 32% of all students who have taken CS182 at Purdue"
      - "You were in the top 24% of all students who have taken CS182 under Sellke"
   - overall course:
      - Highest %ile ranking among courses taken
      - Lowest %ile ranking among courses taken
      - Best semester, ranking wise
      - Worst semester, ranking wise
      - Overall Major %ile
      - Overall Minor %ile
      
