import fs from 'fs';
import readline from 'readline';

const typeMap = {
  'integer': 'integer',
  'bigint': 'bigint',
  'character varying': 'varchar',
  'text': 'text',
  'boolean': 'boolean',
  'timestamp with time zone': 'timestamp',
  'timestamp without time zone': 'timestamp',
  'jsonb': 'jsonb',
  'uuid': 'uuid',
  'numeric': 'numeric'
};

async function generateDrizzleSchema() {
  const fileStream = fs.createReadStream('schema.csv');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const tables = {};
  let isHeader = true;

  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    const parts = line.split(',').map(s => s.replace(/"/g, '').trim());
    if (parts.length < 4) continue;

    const [tableName, columnName, dataType, isNullable] = parts;
    if (!tables[tableName]) tables[tableName] = [];
    tables[tableName].push({ columnName, dataType, isNullable });
  }

  const imports = new Set(['pgTable', 'varchar', 'text', 'integer', 'boolean', 'timestamp', 'jsonb', 'uuid', 'numeric']);
  let output = `import { ${Array.from(imports).join(', ')} } from "drizzle-orm/pg-core";\n\n`;

  for (const [table, columns] of Object.entries(tables)) {
    output += `export const ${table} = pgTable("${table}", {\n`;
    for (const col of columns) {
      const drizzleType = typeMap[col.dataType] || 'text';
      let colDef = `  ${col.columnName}: ${drizzleType}("${col.columnName}")`;
      if (col.columnName === 'id') colDef += `.primaryKey()`;
      if (col.isNullable === 'NO') colDef += `.notNull()`;
      output += `${colDef},\n`;
    }
    output += `});\n\n`;
  }

  fs.writeFileSync('./drizzle/schema.ts', output);
  console.log('Successfully written to ./drizzle/schema.ts');
}

generateDrizzleSchema();