## Comics Table Code

```
CREATE TABLE comics(id varchar(255) NOT NULL, ComicTitle varchar(255) NOT NULL, Description longtext NOT NULL, CoverImage varchar(255) NOT NULL, Origin varchar(255) NOT NULL, Status varchar(255) NOT NULL, Genres varchar(255) NOT NULL, Author varchar(255), Artist varchar(255), Badges varchar(255), Date datetime default current_timestamp, PRIMARY KEY(id));
```

## Chapters Table Code

```
CREATE TABLE chapters(chapterID INT NOT NULL, ComicTitle varchar(255), comicID varchar(255) NOT NULL, ChapterNumber varchar(255) NOT NULL, ChapterName varchar(255), pages LONGTEXT NOT NULL, chapterDate datetime default current_timestamp, Primary Key(chapterID));
```

## Users Table Code

```
Create Table admin(id INT NOT NULL AUTO_INCREMENT, Email varchar(100) NOT NULL, UserName varchar(100) NOT NULL, Password varchar(255) NOT NULL, Primary Key(id));
```


## This is the backend for the https://disasterscans.com I'm leaving the MySql tables if anyone wants to use it
