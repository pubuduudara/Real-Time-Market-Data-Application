import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { NewsArticleEntity } from "./newsArticle.entity";

@Entity("TickerSentiments")
export class TickerSentimentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  ticker!: string;

  @Column("decimal", { nullable: true })
  relevanceScore!: number;

  @Column("decimal", { nullable: true })
  tickerSentimentScore!: number;

  @Column({ nullable: true })
  tickerSentimentLabel!: string;

  @ManyToOne(() => NewsArticleEntity, (article) => article.tickerSentiments, {
    onDelete: "CASCADE",
  })
  newsArticle!: NewsArticleEntity;
}
