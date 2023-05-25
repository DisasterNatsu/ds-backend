## Comics Table Code

```
CREATE TABLE comics(id varchar(255) NOT NULL, ComicTitle varchar(255) NOT NULL, Description varchar(255) NOT NULL, CoverImage varchar(255) NOT NULL, Origin varchar(255) NOT NULL, Status varchar(255) NOT NULL, Genres varchar(255) NOT NULL, Author varchar(255), Artist varchar(255), Badges varchar(255), Date datetime default current_timestamp, PRIMARY KEY(id));
```

## Chapters Table Code

```
CREATE TABLE chapters(id INT NOT NULL, ComicTitle varchar(255), comicID varchar(255), ChapterNumber varchar(255) NOT NULL, ChapterName varchar(255), pages LONGTEXT NOT NULL, Date datetime default current_timestamp, Primary Key(id));
```

## Users Table Code

```
Create Table users(id INT NOT NULL AUTO_INCREMENT, Email varchar(100) NOT NULL, UserName varchar(100) NOT NULL, Password varchar(255) NOT NULL);
```
