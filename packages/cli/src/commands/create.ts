import { Command } from "commander";
import { join } from "path";
import { existsSync, mkdirSync, cpSync } from "fs";
import { PATHS, getCliDir } from "../lib/config.js";

export const createCommand = new Command("create")
  .description("Generate a new CLI from API documentation")
  .argument("<app>", "Name of the API/app (e.g. typefully, dub, mercury)")
  .option("--docs <url>", "URL to API documentation")
  .option("--openapi <url>", "URL to OpenAPI/Swagger spec")
  .option("--base-url <url>", "API base URL")
  .option("--auth-type <type>", "Auth type: bearer, api-key, basic", "bearer")
  .option("--auth-header <header>", "Custom auth header name")
  .option("--force", "Overwrite existing CLI", false)
  .action(async (app: string, options) => {
    const cliDir = getCliDir(app);

    if (existsSync(cliDir) && !options.force) {
      console.error(`CLI already exists at ${cliDir}. Use --force to overwrite.`);
      process.exit(1);
    }

    console.log(`Creating ${app}-cli...`);

    // 1. Create directory
    mkdirSync(cliDir, { recursive: true });

    // 2. Copy template
    const templateDir = PATHS.templateDir;
    if (!existsSync(templateDir)) {
      console.error("Template not found. Run: api2cli doctor");
      process.exit(1);
    }
    cpSync(templateDir, cliDir, { recursive: true });

    // 3. Update package.json with app name
    const pkgPath = join(cliDir, "package.json");
    const pkg = JSON.parse(await Bun.file(pkgPath).text());
    pkg.name = `${app}-cli`;
    pkg.description = `CLI for ${app} API`;
    pkg.bin = { [`${app}-cli`]: "./dist/index.js" };
    await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));

    // 4. Update src/index.ts with app name
    const indexPath = join(cliDir, "src", "index.ts");
    let indexContent = await Bun.file(indexPath).text();
    indexContent = indexContent.replaceAll("{{APP_NAME}}", app);
    indexContent = indexContent.replaceAll("{{APP_CLI}}", `${app}-cli`);
    await Bun.write(indexPath, indexContent);

    // 5. Update client with base URL and auth
    const clientPath = join(cliDir, "src", "lib", "client.ts");
    let clientContent = await Bun.file(clientPath).text();
    clientContent = clientContent.replaceAll("{{BASE_URL}}", options.baseUrl || "https://api.example.com");
    clientContent = clientContent.replaceAll("{{AUTH_TYPE}}", options.authType);
    clientContent = clientContent.replaceAll("{{AUTH_HEADER}}", options.authHeader || "Authorization");
    clientContent = clientContent.replaceAll("{{APP_NAME}}", app);
    await Bun.write(clientPath, clientContent);

    console.log(`\n✅ Created ${app}-cli at ${cliDir}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Add resources: edit ${join(cliDir, "src", "resources")}/`);
    console.log(`  2. Build: api2cli bundle ${app}`);
    console.log(`  3. Link: api2cli link ${app}`);
    console.log(`  4. Auth: ${app}-cli auth set "your-token"`);
  });
