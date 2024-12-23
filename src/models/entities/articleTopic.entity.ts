import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { NewsArticleEntity } from "./newsArticle.entity";

@Entity("ArticleTopics")
export class ArticleTopicEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  topic!: string;

  @Column("decimal")
  relevanceScore!: number;

  @ManyToOne(() => NewsArticleEntity, (article) => article.topics, {
    onDelete: "CASCADE",
  })
  newsArticle!: NewsArticleEntity;
}
