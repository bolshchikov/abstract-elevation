import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  sourceCode: string;
}

const defaultComment = `
/**
 * 
 * Hello, stranger!!
 * Welcome to Essence.io
 * 
 * I'm your navigator around the architecture
 * You can see the existing API surface and main building blocks.
 * 
 * How does it work?
 * 
 * We scanned, analyzed your code and sprinkled some magic over you code 
 * to show how it actually looks like.
 * 
 * | APIs                |     Architecture        |   Source code             |
 * |---------------------|-------------------------|---------------------------|
 * | here you will see   | here you see the        | click on any block        |
 * | the existing API    | overall architecture    | on the diagram and here   |
 * |                     |                         | you see the source code   |
 * |---------------------|-------------------------|---------------------------|
 * 
 * 
 */
`;

const Editor = ({ sourceCode = defaultComment }: EditorProps) => {
  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="typescript"
      theme="vs-dark"
      defaultValue={defaultComment}
      value={sourceCode}
      options={{
        minimap: { enabled: false },
      }}
    />
  );
};

export default Editor;
