import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { NewsArticleEntity } from "./newsArticle.entity";

@Entity("Authors")
export class AuthorEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => NewsArticleEntity, (article) => article.authors, {
    onDelete: "CASCADE",
  })
  newsArticle!: NewsArticleEntity;
}
