/**
 * K-FreeLang AST Node Types
 * Abstract Syntax Tree 노드 정의
 */

export interface ASTNode {
  type: string;
  line: number;
  column: number;
}

// Program 최상위 노드
export interface Program extends ASTNode {
  type: 'Program';
  statements: Statement[];
}

// 문장 타입들
export type Statement =
  | UseStatement
  | ModuleDeclaration
  | FunctionDeclaration
  | TypeDeclaration
  | EnumDeclaration
  | TraitDeclaration
  | ImplBlock
  | NamespaceDeclaration
  | ExpressionStatement
  | IfStatement
  | ForStatement
  | WhileStatement
  | ReturnStatement
  | ThrowStatement
  | TryStatement
  | VariableDeclaration
  | ConstantDeclaration
  | AsyncFunctionDeclaration
  | ExtendDeclaration
  | MacroDeclaration;

// Use Statement
export interface UseStatement extends ASTNode {
  type: 'UseStatement';
  module: string;
  path: string;
}

// Module Declaration
export interface ModuleDeclaration extends ASTNode {
  type: 'ModuleDeclaration';
  name: string;
  body: Statement[];
  isPublic?: boolean;
}

// Function Declaration
export interface FunctionDeclaration extends ASTNode {
  type: 'FunctionDeclaration';
  name: string;
  parameters: Parameter[];
  returnType: TypeAnnotation;
  body: BlockStatement;
  isAsync?: boolean;
  isUnsafe?: boolean;
  isPublic?: boolean;
  isStatic?: boolean;
}

// Async Function Declaration
export interface AsyncFunctionDeclaration extends ASTNode {
  type: 'AsyncFunctionDeclaration';
  name: string;
  parameters: Parameter[];
  returnType: TypeAnnotation;
  body: BlockStatement;
}

// Macro Declaration
export interface MacroDeclaration extends ASTNode {
  type: 'MacroDeclaration';
  name: string;
  parameters: string[];
  body: Statement[];
}

// Parameter 정의
export interface Parameter extends ASTNode {
  type: 'Parameter';
  name: string;
  typeAnnotation: TypeAnnotation;
  isMutable?: boolean;
  isRef?: boolean;
}

// Type Annotation
export interface TypeAnnotation extends ASTNode {
  type: 'TypeAnnotation';
  name: string;
  isArray?: boolean;
  isMap?: boolean;
  keyType?: TypeAnnotation;
  valueType?: TypeAnnotation;
  elementType?: TypeAnnotation;
  isRef?: boolean;
  lifetime?: string;
}

// Type Declaration
export interface TypeDeclaration extends ASTNode {
  type: 'TypeDeclaration';
  name: string;
  definition: TypeDefinition;
  isPublic?: boolean;
}

export type TypeDefinition =
  | EnumDef
  | StructDef
  | AliasDef
  | InheritanceDef;

export interface EnumDef extends ASTNode {
  type: 'EnumDef';
  variants: EnumVariant[];
}

export interface EnumVariant extends ASTNode {
  type: 'EnumVariant';
  name: string;
  fields?: TypeAnnotation[];
}

export interface StructDef extends ASTNode {
  type: 'StructDef';
  fields: StructField[];
}

export interface StructField extends ASTNode {
  type: 'StructField';
  name: string;
  fieldType: TypeAnnotation;
}

export interface AliasDef extends ASTNode {
  type: 'AliasDef';
  targetType: TypeAnnotation;
}

export interface InheritanceDef extends ASTNode {
  type: 'InheritanceDef';
  baseType: string;
  fields: StructField[];
}

// Enum Declaration
export interface EnumDeclaration extends ASTNode {
  type: 'EnumDeclaration';
  name: string;
  variants: EnumVariant[];
  isPublic?: boolean;
}

// Trait Declaration
export interface TraitDeclaration extends ASTNode {
  type: 'TraitDeclaration';
  name: string;
  methods: FunctionSignature[];
  isPublic?: boolean;
}

export interface FunctionSignature extends ASTNode {
  type: 'FunctionSignature';
  name: string;
  parameters: Parameter[];
  returnType: TypeAnnotation;
}

// Impl Block
export interface ImplBlock extends ASTNode {
  type: 'ImplBlock';
  traitName: string;
  methods: FunctionDeclaration[];
}

// Namespace Declaration
export interface NamespaceDeclaration extends ASTNode {
  type: 'NamespaceDeclaration';
  name: string;
  body: Statement[];
}

// Extend Declaration
export interface ExtendDeclaration extends ASTNode {
  type: 'ExtendDeclaration';
  targetType: string;
  methods: FunctionDeclaration[];
}

// Variable & Constant Declarations
export interface VariableDeclaration extends ASTNode {
  type: 'VariableDeclaration';
  name: string;
  typeAnnotation?: TypeAnnotation;
  initializer?: Expression;
  isMutable?: boolean;
}

export interface ConstantDeclaration extends ASTNode {
  type: 'ConstantDeclaration';
  name: string;
  typeAnnotation?: TypeAnnotation;
  initializer: Expression;
}

// Control Flow Statements
export interface IfStatement extends ASTNode {
  type: 'IfStatement';
  condition: Expression;
  thenBranch: BlockStatement;
  elseBranch?: BlockStatement | IfStatement;
}

export interface ForStatement extends ASTNode {
  type: 'ForStatement';
  initializer?: VariableDeclaration | Expression;
  condition?: Expression;
  update?: Expression;
  body: BlockStatement;
}

export interface WhileStatement extends ASTNode {
  type: 'WhileStatement';
  condition: Expression;
  body: BlockStatement;
}

export interface ReturnStatement extends ASTNode {
  type: 'ReturnStatement';
  value?: Expression;
}

export interface ThrowStatement extends ASTNode {
  type: 'ThrowStatement';
  error: Expression;
}

export interface TryStatement extends ASTNode {
  type: 'TryStatement';
  tryBlock: BlockStatement;
  catchBlock?: BlockStatement;
}

// Expression Statement
export interface ExpressionStatement extends ASTNode {
  type: 'ExpressionStatement';
  expression: Expression;
}

// Block Statement
export interface BlockStatement extends ASTNode {
  type: 'BlockStatement';
  statements: Statement[];
}

// ===================== EXPRESSIONS =====================

export type Expression =
  | BinaryExpression
  | UnaryExpression
  | CallExpression
  | MemberExpression
  | ArrayLiteral
  | ObjectLiteral
  | Identifier
  | Literal
  | MatchExpression
  | GenericExpression
  | AwaitExpression;

export interface BinaryExpression extends ASTNode {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends ASTNode {
  type: 'UnaryExpression';
  operator: string;
  operand: Expression;
  isPrefix: boolean;
}

export interface CallExpression extends ASTNode {
  type: 'CallExpression';
  callee: Expression;
  arguments: Expression[];
  typeArguments?: TypeAnnotation[];
}

export interface MemberExpression extends ASTNode {
  type: 'MemberExpression';
  object: Expression;
  property: string | Expression;
  isComputed: boolean;
}

export interface ArrayLiteral extends ASTNode {
  type: 'ArrayLiteral';
  elements: Expression[];
}

export interface ObjectLiteral extends ASTNode {
  type: 'ObjectLiteral';
  properties: ObjectProperty[];
}

export interface ObjectProperty extends ASTNode {
  type: 'ObjectProperty';
  key: string;
  value: Expression;
}

export interface Identifier extends ASTNode {
  type: 'Identifier';
  name: string;
  isKorean?: boolean;
}

export interface Literal extends ASTNode {
  type: 'Literal';
  value: string | number | boolean | null;
  literalType: 'number' | 'string' | 'boolean' | 'null';
}

export interface MatchExpression extends ASTNode {
  type: 'MatchExpression';
  expression: Expression;
  arms: MatchArm[];
}

export interface MatchArm extends ASTNode {
  type: 'MatchArm';
  pattern: Pattern;
  guard?: Expression;
  body: Expression | BlockStatement;
}

export type Pattern =
  | IdentifierPattern
  | LiteralPattern
  | RangePattern
  | WildcardPattern
  | OrPattern;

export interface IdentifierPattern extends ASTNode {
  type: 'IdentifierPattern';
  name: string;
}

export interface LiteralPattern extends ASTNode {
  type: 'LiteralPattern';
  value: string | number;
}

export interface RangePattern extends ASTNode {
  type: 'RangePattern';
  start: number;
  end: number;
  inclusive: boolean;
}

export interface WildcardPattern extends ASTNode {
  type: 'WildcardPattern';
}

export interface OrPattern extends ASTNode {
  type: 'OrPattern';
  patterns: Pattern[];
}

export interface GenericExpression extends ASTNode {
  type: 'GenericExpression';
  base: Expression;
  typeArguments: TypeAnnotation[];
}

export interface AwaitExpression extends ASTNode {
  type: 'AwaitExpression';
  expression: Expression;
}
