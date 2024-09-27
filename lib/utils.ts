import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import fs from "node:fs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSchema(
  path: string,
  name: string,
  relativePath: string,
  importSpecifier: string,
  moduleSpecifier: string
) {
  fs.readFile(path, "utf8", (err, content) => {
    if (err) {
      console.error(err);
      return;
    }

    const schema = {
      name: name,
      type: "registry:block",
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
      files: [
        {
          path: relativePath,
          type: "registry:block",
          content: content,
        },
      ],
      tailwind: {},
      cssVars: {},
      meta: {
        importSpecifier: importSpecifier,
        moduleSpecifier: moduleSpecifier,
      },
    };

    fs.writeFile("./schema.json", JSON.stringify(schema, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("schema created!");
    });
  });
}
