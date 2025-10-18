import React from 'react';

interface GitHubHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-gray-900 rounded-md p-4 mt-2 mb-4 text-sm text-cyan-300 overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const GitHubHelpModal: React.FC<GitHubHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl p-8 m-4 relative animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Save Project to GitHub
        </h2>
        <p className="text-center text-gray-400 mb-6">Follow these steps using the command line to upload your project code to a new GitHub repository.</p>

        <div className="text-gray-300 space-y-4 text-left">
          <div>
            <h3 className="font-semibold text-lg text-cyan-300">Step 1: Initialize a Git Repository</h3>
            <p>In your project's root directory, run this command to start tracking your project with Git.</p>
            <CodeBlock>git init</CodeBlock>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-cyan-300">Step 2: Add Your Files</h3>
            <p>Stage all your project files to be included in the first "snapshot" or commit.</p>
            <CodeBlock>git add .</CodeBlock>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-cyan-300">Step 3: Make Your First Commit</h3>
            <p>A commit saves your staged changes. The message should describe what you've done.</p>
            <CodeBlock>git commit -m "Initial commit of SmartLearn platform"</CodeBlock>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-cyan-300">Step 4: Create a Repository on GitHub.com</h3>
            <p>Go to GitHub, create a new repository. Give it a name, but <strong className="text-yellow-400">do not</strong> initialize it with a README or other files, as you already have a project locally.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-cyan-300">Step 5: Link Local to Remote & Push</h3>
            <p>GitHub will provide you with commands to connect your local repository to the one you just created. They will look like this (use the ones from your repository page):</p>
            <CodeBlock>{`git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main`}</CodeBlock>
            <p>After running these, your code will be on GitHub!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubHelpModal;