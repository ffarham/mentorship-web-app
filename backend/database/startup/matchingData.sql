INSERT INTO users VALUES (DEFAULT, 'jimbob@gmail.com', FALSE, 'Jimothy Bobson', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'one', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'bobjim@gmail.com', FALSE, 'Bobothy Jimson', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'xb8cc4e102073baaf', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'lez@gmail.com', FALSE, 'Lez', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'x3b70ffbe4908bc99', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'farquaad@gmail.com', FALSE, 'Lord Farquaad', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'x3b70ffbe4908bc99', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'amogus@gmail.com', FALSE, 'Amogus Susson', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'xb7bf09524d06d973', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'ur_da@gmail.com', FALSE, 'Your Father', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'two', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'scott_tenorman@gmail.com', FALSE, 'Scott Tenorman', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'x47fedeb585799d7b', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'chemiscool@gmail.com', FALSE, 'Walter White', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'xdae5f4174b80dcf0', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'sasee@gmail.com', FALSE, 'Sassy the Sasquatch', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'x67cf6db69bcd78e0', 'qwerty', TRUE, 'a');

INSERT INTO mentee SELECT userID from users;

INSERT INTO users VALUES (DEFAULT, 'mentor1@gmail.com', FALSE, 'Alex', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor2@gmail.com', FALSE, 'Anne', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor3@gmail.com', FALSE, 'Astolfo', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor4@gmail.com', FALSE, 'Brian', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor5@gmail.com', FALSE, 'James', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor6@gmail.com', FALSE, 'Hajime', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor7@gmail.com', FALSE, 'Cerulea', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor8@gmail.com', FALSE, 'Peter', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor9@gmail.com', FALSE, 'Mahito', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor10@gmail.com', FALSE, 'Stein', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');
INSERT INTO users VALUES (DEFAULT, 'mentor11@gmail.com', FALSE, 'Fullmetal', '$2a$10$.ZXZTav8jqD8HbjkNRPq1.pTfKJw7Skb0ysXpenvohAy.BYoV6Yu6', 'three', 'qwerty', TRUE, 'a');

INSERT INTO  mentor SELECT userid FROM users WHERE email LIKE 'mentor%';

/*Alex can't have any more mentees*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Alex' AND B.name = 'Jimothy Bobson';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Alex' AND B.name = 'Eric Cartman';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Alex' AND B.name = 'Lord Farquaad';

/*INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Alex' AND B.name = 'Bobothy Jimson';*/

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Alex' AND B.name = 'Amogus Susson';

/*Anne can*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Anne' AND B.name = 'Amogus Susson';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Anne' AND B.name = 'Your Father';

/*Brian*/

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Brian' AND B.name = 'Lord Farquaad';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Brian' AND B.name = 'Scott Tenorman';

INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Brian' AND B.name = 'Walter White';

/*James*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'James' AND B.name = 'Walter White';

/*Peter*/
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Peter' AND B.name = 'Big Lez';

/*Cerulea*/
/*INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Cerulea' AND B.name = 'The King of Edge';*/

/* Hajime */
INSERT INTO mentoring SELECT A.userID, b.userID from users A, users B
WHERE A.name = 'Hajime' AND B.name = 'Big Lez';




INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Research', 'mentor', 1 from users where users.name = 'Alex';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Risk', 'mentor', 3  from users where users.name = 'Alex';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Marketing', 'mentor', 4 from users where users.name = 'Alex';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Sales', 'mentor', 2  from users where users.name = 'Alex';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Research', 'mentor', 1 from users where users.name = 'Anne';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Risk', 'mentor', 3  from users where users.name = 'Anne';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Stocks', 'mentor', 2  from users where users.name = 'Anne';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Bonds', 'mentor', 4  from users where users.name = 'Anne';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Growth', 'mentor', 1  from users where users.name = 'James';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Marketing', 'mentor', 3  from users where users.name = 'James';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Sales', 'mentor', 2  from users where users.name = 'James';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Research', 'mentor', 4  from users where users.name = 'Brian';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'IPO', 'mentor', 3  from users where users.name = 'Brian';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Risk', 'mentor', 2  from users where users.name = 'Brian';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'HFT', 'mentor', 1  from users where users.name = 'Brian';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'HFT', 'mentor', 1 from users where users.name = 'Peter';
INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'IPO', 'mentor', 2  from users where users.name = 'Peter';

INSERT INTO interest (userid, interest, kind, ordering) SELECT userid, 'Sales', 'mentor', 1  from users where users.name = 'Cerulea';

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
INSERT into interest(userid, interest, kind, ordering) SELECT userid, 'Quant', 'mentor', 1 from users where users.name = 'James';




