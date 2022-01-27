import csv
import random

datafile = open('dummy_users.csv', 'r')
data = list(csv.reader(datafile, delimiter=','))

writefile = open('dummy_users.sql', 'w')

for person in data[1:]:
    if person == []:
        continue
    
    insertStatement = "INSERT INTO users VALUES ('{email}', FALSE, '{name}', sha512('{password}'::BYTEA || '\\x{salt}'::BYTEA), '\\x{salt}');\n".format(email = person[0], name = person[1], password = person[2], salt = str(hex(random.getrandbits(64))[2:] ))

    writefile.write(insertStatement)

    



