import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ArticleTopicEntity } from "./articleTopic.entity";
import { TickerSentimentEntity } from "./tickerSentiment.entity";

@Entity("NewsArticles")
export class NewsArticleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  url!: string;

  @Column({ type: "timestamp", nullable: true })
  timePublished!: Date;

  @Column("text", { array: true })
  authors!: string[];

  @Column({ nullable: true })
  summary!: string;

  @Column({ nullable: true })
  bannerImage!: string;

  @Column()
  source!: string;

  @Column({ nullable: true })
  categoryWithinSource!: string;

  @Column()
  sourceDomain!: string;

  @Column("decimal", { nullable: true })
  overallSentimentScore!: number;

  @Column({ nullable: true })
  overallSentimentLabel!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ArticleTopicEntity, (topic) => topic.newsArticle, {
    cascade: true,
  })
  topics!: ArticleTopicEntity[];

  @OneToMany(() => TickerSentimentEntity, (ticker) => ticker.newsArticle, {
    cascade: true,
  })
  tickerSentiments!: TickerSentimentEntity[];
}
