CREATE TABLE `assistant_usage` (
	`bucket` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `assistant_usage_expiry` ON `assistant_usage` (`expires_at`);