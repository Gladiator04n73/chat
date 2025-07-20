CREATE USER IF NOT EXISTS 'instagram'@'172.%.%.%' IDENTIFIED BY 'superinsta';
GRANT ALL ON *.* to 'instagram'@'%.%.%.%';
FLUSH HOSTS;
