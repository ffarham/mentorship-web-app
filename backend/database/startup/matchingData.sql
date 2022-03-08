INSERT INTO users VALUES (DEFAULT, 'jimbob@gmail.com', FALSE, 'Jimothy Bobson', 'password1', 'one', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'bobjim@gmail.com', FALSE, 'Bobothy Jimson', 'password2', 'xb8cc4e102073baaf', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'biglez@gmail.com', FALSE, 'Big Lez', 'password3', 'x3b70ffbe4908bc99', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'xX_eric_cartman_Xx@gmail.com', FALSE, 'Eric Cartman', 'password4', 'xbc33175c54dbf5d9', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'farquaad@gmail.com', FALSE, 'Lord Farquaad', 'password5', 'x3b70ffbe4908bc99', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'amogus@gmail.com', FALSE, 'Amogus Susson', 'password6', 'xb7bf09524d06d973', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'ur_da@gmail.com', FALSE, 'Your Father', 'password7', 'two', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'scott_tenorman@gmail.com', FALSE, 'Scott Tenorman', 'password8', 'x47fedeb585799d7b', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'totally_not_a_meth_dealer@gmail.com', FALSE, 'Walter White', 'password9', 'xdae5f4174b80dcf0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'xXsupreme_edgelordXx@gmail.com', FALSE, 'The King of Edge', 'password10', 'x4c56e14db5a41cc2', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'sasee@gmail.com', FALSE, 'Sassy the Sasquatch', 'password11', 'x67cf6db69bcd78e0', 'qwerty', TRUE);

INSERT INTO mentee SELECT userID from users;

INSERT INTO users VALUES (DEFAULT, 'mentor1@gmail.com', FALSE, 'Alex', 'password1', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor2@gmail.com', FALSE, 'Anne', 'password2', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor3@gmail.com', FALSE, 'Astolfo', 'password3', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor4@gmail.com', FALSE, 'Brian', 'password4', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor5@gmail.com', FALSE, 'Brienne', 'password5', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor6@gmail.com', FALSE, 'Hajime', 'password6', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor7@gmail.com', FALSE, 'Cerulea', 'password7', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor8@gmail.com', FALSE, 'Hyouoin Kyouma', 'password8', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor9@gmail.com', FALSE, 'Mahito', 'password9', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor10@gmail.com', FALSE, 'Stein', 'password10', 'three', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor11@gmail.com', FALSE, 'Fullmetal', 'password11', 'three', 'qwerty', TRUE);

INSERT INTO  mentor SELECT userid FROM users WHERE email LIKE 'mentor%';

/*Astolfo can't have any more mentees*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Astolfo' AND B.name = 'Jimothy Bobson';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Astolfo' AND B.name = 'Eric Cartman';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Astolfo' AND B.name = 'Lord Farquaad';

/*INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Astolfo' AND B.name = 'Bobothy Jimson';*/

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Astolfo' AND B.name = 'Amogus Susson';

/*Stein can*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Stein' AND B.name = 'Amogus Susson';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Stein' AND B.name = 'Your Father';

/*Fullmetal*/

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Fullmetal' AND B.name = 'Lord Farquaad';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Fullmetal' AND B.name = 'Scott Tenorman';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Fullmetal' AND B.name = 'Walter White';

/*Mahito*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Mahito' AND B.name = 'Walter White';

/*Hyouoin Kyouma*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Hyouoin Kyouma' AND B.name = 'Big Lez';

/*Cerulea*/
/*INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Cerulea' AND B.name = 'The King of Edge';*/

/* Hajime */
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Hajime' AND B.name = 'Big Lez';




INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Research', 'mentor', 1 from users where users.name = 'Astolfo';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Risk', 'mentor', 3 from users where users.name = 'Astolfo';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Marketing', 'mentor', 4 from users where users.name = 'Astolfo';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Sales', 'mentor', 2 from users where users.name = 'Astolfo';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Research', 'mentor', 1 from users where users.name = 'Stein';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Risk', 'mentor', 3 from users where users.name = 'Stein';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Stocks', 'mentor', 2 from users where users.name = 'Stein';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Bonds', 'mentor', 4 from users where users.name = 'Stein';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Growth', 'mentor', 1 from users where users.name = 'Mahito';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Marketing', 'mentor', 3 from users where users.name = 'Mahito';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Sales', 'mentor', 2 from users where users.name = 'Mahito';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Research', 'mentor', 4 from users where users.name = 'Fullmetal';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'IPO', 'mentor', 3 from users where users.name = 'Fullmetal';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Risk', 'mentor', 2 from users where users.name = 'Fullmetal';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'HFT', 'mentor', 1 from users where users.name = 'Fullmetal';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'HFT', 'mentor', 1 from users where users.name = 'Hyouoin Kyouma';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'IPO', 'mentor', 2 from users where users.name = 'Hyouoin Kyouma';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Sales', 'mentor', 1 from users where users.name = 'Cerulea';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'M&A', 'mentor', 1 from users where users.name = 'Hajime';





/*Jimothy's Interests*/

INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Risk', 'mentee', 1 from users where users.name = 'Jimothy Bobson';
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'IPO', 'mentee', 3 from users where users.name = 'Jimothy Bobson';
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Sales', 'mentee', 2 from users where users.name = 'Jimothy Bobson';

INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Marketing', 'mentee', 1 from users where users.name = 'Your Father';
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'IPO', 'mentee', 2 from users where users.name = 'Your Father';
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'M&A', 'mentee', 3 from users where users.name = 'Your Father';

/*INSERT into interest(userid, interest, kind, rnk) SELECT userid, 'Research', 'mentee', 2 from users where users.name = 'Scott Tenorman';
INSERT into interest(userid, interest, kind, rnk) SELECT userid, 'M&A', 'mentee', 1 from users where users.name = 'Scott Tenorman';*/


/* Other people's shit */

INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Quant', 'mentor', 1 from users where users.name = 'Alex';
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Quant', 'mentor', 1 from users where users.name = 'Anne';
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Quant', 'mentor', 1 from users where users.name = 'Brian';
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Quant', 'mentor', 1 from users where users.name = 'Brienne';




