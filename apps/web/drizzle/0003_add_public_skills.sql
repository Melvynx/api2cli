ALTER TABLE "skills" ADD COLUMN "skill_type" text DEFAULT 'generated';
ALTER TABLE "skills" ADD COLUMN "install_command" text;
ALTER TABLE "skills" ADD COLUMN "skill_github_path" text;
