INSERT INTO users VALUES (DEFAULT, 'jimbob@gmail.com', FALSE, 'Jimothy Bobson', 'password1', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'bobjim@gmail.com', FALSE, 'Bobothy Jimson', 'password2', '\xb8cc4e102073baaf', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'biglez@gmail.com', FALSE, 'Big Lez', 'password3', '\x3b70ffbe4908bc99', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'xX_eric_cartman_Xx@gmail.com', FALSE, 'Eric Cartman', 'password4', '\xbc33175c54dbf5d9', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'farquaad@gmail.com', FALSE, 'Lord Farquaad', 'password5', '\xbcf39483cb7763cd', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'amogus@gmail.com', FALSE, 'Amogus Susson', 'password6', '\xb7bf09524d06d973', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'ur_da@gmail.com', FALSE, 'Your Father', 'password7', '\xcabed0e1d62afb1c', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'scott_tenorman@gmail.com', FALSE, 'Scott Tenorman', 'password8', '\x47fedeb585799d7b', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'totally_not_a_meth_dealer@gmail.com', FALSE, 'Walter White', 'password9', '\xdae5f4174b80dcf0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'xXsupreme_edgelordXx@gmail.com', FALSE, 'The King of Edge', 'password10', '\x4c56e14db5a41cc2', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'sasee@gmail.com', FALSE, 'Sassy the Sasquatch', 'password11', '\x67cf6db69bcd78e0', 'qwerty', TRUE);

INSERT INTO mentee SELECT userID from users;

INSERT INTO users VALUES (DEFAULT, 'mentor1@gmail.com', FALSE, 'Alex', 'password1', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor2@gmail.com', FALSE, 'Anne', 'password2', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor3@gmail.com', FALSE, 'Astolfo', 'password3', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor4@gmail.com', FALSE, 'Brian', 'password4', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor5@gmail.com', FALSE, 'Brienne', 'password5', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor6@gmail.com', FALSE, 'Carl', 'password6', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor7@gmail.com', FALSE, 'Cerulea', 'password7', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor8@gmail.com', FALSE, 'Hyouoin Kyouma', 'password8', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor9@gmail.com', FALSE, 'Mahito', 'password9', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor10@gmail.com', FALSE, 'Stein', 'password10', '\xba0149ebc03cf8d0', 'qwerty', TRUE);
INSERT INTO users VALUES (DEFAULT, 'mentor11@gmail.com', FALSE, 'Fullmetal', 'password11', '\xba0149ebc03cf8d0', 'qwerty', TRUE);

INSERT INTO mentor SELECT userid FROM users WHERE email LIKE 'mentor';