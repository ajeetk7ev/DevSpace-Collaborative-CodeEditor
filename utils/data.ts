export const languages = ["javascript", "typescript", "python", "cpp", "c", "java", "go"];

export const defaultCodes: Record<string, string> = {
  javascript: `console.log("Hello, JavaScript!");`,
  typescript: `const greet = (name: string): void => {\n  console.log("Hello, " + name);\n};\ngreet("TypeScript");`,
  python: `def greet(name):\n    print("Hello,", name)\n\ngreet("Python")`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, C!\\n");\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`,
  go: `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}`,
};


export const languageMap: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  cpp: 54,
  c: 50,
  java: 62,
  go: 60,
};

export const editorThemes = ["vs-dark", "light"];
export const fontSizes = ["12", "14", "16", "18", "20", "24"];
