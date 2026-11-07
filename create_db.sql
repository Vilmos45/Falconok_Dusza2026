
create database robotszim;
use robotszim;

create table users(
    username VARCHAR(255) PRIMARY KEY not null,
    password VARCHAR(255) not null
);

create table ranglista(
    id int PRIMARY KEY auto_increment,
    palya VARCHAR(255) not null,
    username VARCHAR(255) not null,
    lepesek int not null,
    aranyrogok int not null,
    Foreign Key (username) REFERENCES users(username) on delete CASCADE
);
