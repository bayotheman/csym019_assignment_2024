create table club(
    id varchar(255),
    name varchar(255),
    city varchar(255),
    manager varchar(255),
    established varchar(255),
    president varchar(255),
    noOfTrophies varchar(255)
);

create table fixtures(
    id int,
    position int,
    homeId varchar(255),
    awayId varchar(255),
    home varchar(255),
    away varchar(255),
    homeScore int,
    awayScore int,
    date varchar(255)
);


create table ranking(
    tid varchar(255),
    name varchar(255),
    logo blob,
    played int,
    won int,
    drawn int,
    lost int,
    gf int,
    against int,
    gd int,
    points int
);


