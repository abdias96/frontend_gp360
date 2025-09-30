#!/usr/bin/env node

/**
 * Script para encontrar y sugerir fixes para campos de fecha mal formateados
 * Este script busca archivos Vue que tengan inputs de tipo date pero que asignen
 * fechas directamente sin formatear.
 */

const fs = require('fs');
const path = require('path');

function findVueFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDir(fullPath);
      } else if (item.endsWith('.vue')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return files;
}

function analyzeDateInputs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Buscar inputs de tipo date
  const dateInputMatches = content.match(/type="date"[\s\S]*?v-model="[^"]+"/g);
  if (!dateInputMatches) return issues;
  
  for (const match of dateInputMatches) {
    const vModelMatch = match.match(/v-model="([^"]+)"/);
    if (vModelMatch) {
      const fieldName = vModelMatch[1];
      
      // Buscar asignaciones directas de este campo sin formatear
      const assignmentPatterns = [
        new RegExp(`${fieldName.replace(/\./g, '\\.')}\\s*:\\s*([^,\\n}]+(?:date|Date)[^,\\n}]*),?`, 'g'),
        new RegExp(`${fieldName.replace(/\./g, '\\.')}\\s*=\\s*([^;\\n]+(?:date|Date)[^;\\n]*);?`, 'g'),
      ];
      
      for (const pattern of assignmentPatterns) {
        let assignmentMatch;
        while ((assignmentMatch = pattern.exec(content)) !== null) {
          const assignment = assignmentMatch[1].trim();
          
          // Si la asignación no incluye formatDateForInput, es un problema
          if (!assignment.includes('formatDateForInput') && 
              !assignment.includes("''") && 
              !assignment.includes('""') &&
              assignment.includes('date')) {
            issues.push({
              field: fieldName,
              assignment: assignment,
              line: content.substring(0, assignmentMatch.index).split('\n').length,
              fullMatch: assignmentMatch[0]
            });
          }
        }
      }
    }
  }
  
  return issues;
}

function main() {
  const srcDir = path.join(__dirname, 'src');
  console.log('🔍 Escaneando archivos Vue para problemas de formato de fecha...\n');
  
  const vueFiles = findVueFiles(srcDir);
  let totalIssues = 0;
  
  for (const file of vueFiles) {
    const issues = analyzeDateInputs(file);
    
    if (issues.length > 0) {
      const relativePath = path.relative(__dirname, file);
      console.log(`📄 ${relativePath}`);
      
      for (const issue of issues) {
        console.log(`  ❌ Línea ${issue.line}: Campo '${issue.field}'`);
        console.log(`     Asignación problemática: ${issue.assignment}`);
        console.log(`     Sugerido: formatDateForInput(${issue.assignment})`);
        console.log('');
      }
      
      totalIssues += issues.length;
    }
  }
  
  if (totalIssues === 0) {
    console.log('✅ No se encontraron problemas de formato de fecha!');
  } else {
    console.log(`\n📊 Total de problemas encontrados: ${totalIssues}`);
    console.log('\n💡 Para corregir estos problemas:');
    console.log('1. Importar: import { formatDateForInput } from "@/core/helpers/date-formatters";');
    console.log('2. Reemplazar las asignaciones directas con formatDateForInput(valor)');
  }
}

if (require.main === module) {
  main();
}

module.exports = { findVueFiles, analyzeDateInputs };