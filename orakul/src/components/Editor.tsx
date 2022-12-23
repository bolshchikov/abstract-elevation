import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  sourceCode: string;
}

const Editor = ({ sourceCode = '' }: EditorProps) => {
  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="typescript"
      theme="vs-dark"
      defaultValue='// click on node to see the source code'
      value={sourceCode}
      options={{
        minimap: { enabled: false },
      }}
    />
  );
};

export default Editor;