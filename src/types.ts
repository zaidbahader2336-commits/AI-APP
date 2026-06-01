export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  componentsAdded?: string[];
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

export interface DatabaseRow {
  id: number;
  email: string;
  name: string;
  profile_picture_url: string;
  role: 'User' | 'Admin' | 'Developer' | 'Product' | 'Manager';
  created_at: string;
}

export interface SecurityCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'scanning';
  message: string;
}

export type TabKey = 'dashboard' | 'screens' | 'code' | 'components' | 'database' | 'security';

export interface WorkspaceData {
  title: string;
  techStack: string[];
  previewHeaderTitle: string;
  previewWidgets: any[];
  sampleUsers: any[];
  sampleProducts: any[];
  sampleOrders: any[];
  securityChecks: any[];
  activeCode: string;
}
