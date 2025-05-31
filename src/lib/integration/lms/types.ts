/**
 * LTI Types and Interfaces
 * 
 * This file defines the types and interfaces used in the LTI 1.3 implementation
 * for the EdPsych Connect platform.
 */

/**
 * LTI Message Types as defined in the LTI 1.3 specification
 */
export enum LTIMessageType {
  RESOURCE_LINK_REQUEST = 'LtiResourceLinkRequest',
  DEEP_LINKING_REQUEST = 'LtiDeepLinkingRequest',
  SUBMISSION_REVIEW_REQUEST = 'LtiSubmissionReviewRequest',
  CONTENT_ITEM_SELECTION = 'ContentItemSelectionRequest', // LTI 1.1 legacy
  DEEP_LINKING_RESPONSE = 'LtiDeepLinkingResponse'
}

/**
 * LTI Version identifiers
 */
export enum LTIVersion {
  V1_0 = 'LTI-1p0',
  V1_1 = 'LTI-1p1',
  V1_3 = '1.3.0'
}

/**
 * LTI Deployment States
 */
export enum LTIDeploymentState {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

/**
 * LTI Platform Registration
 */
export interface LTIPlatformRegistration {
  id: string;
  tenantId: string;
  platformName: string;
  clientId: string;
  deploymentId?: string;
  issuer: string;
  authenticationEndpoint: string;
  tokenEndpoint: string;
  keysetUrl: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  updatedAt: Date;
  state: LTIDeploymentState;
}

/**
 * LTI OIDC State
 */
export interface LTIOidcState {
  id: string;
  state: string;
  nonce: string;
  loginHint: string;
  messageHint?: string;
  targetLinkUri: string;
  registrationId: string;
  tenantId: string;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * LTI Resource Link
 */
export interface LTIResourceLink {
  id: string;
  resourceLinkId: string;
  contextId: string;
  deploymentId: string;
  registrationId: string;
  tenantId: string;
  title?: string;
  description?: string;
  lineItemUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * LTI Context (Course)
 */
export interface LTIContext {
  id: string;
  contextId: string;
  deploymentId: string;
  registrationId: string;
  tenantId: string;
  title?: string;
  label?: string;
  type?: string[];
  namesAndRolesUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * LTI User
 */
export interface LTIUser {
  id: string;
  userId: string;
  deploymentId: string;
  registrationId: string;
  tenantId: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  middleName?: string;
  email?: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * LTI Score
 */
export interface LTIScore {
  userId: string;
  scoreGiven: number;
  scoreMaximum: number;
  comment?: string;
  activityProgress: 'Initialized' | 'Started' | 'InProgress' | 'Submitted' | 'Completed';
  gradingProgress: 'NotReady' | 'Failed' | 'Pending' | 'PendingManual' | 'FullyGraded';
  timestamp: string;
}

/**
 * LTI Content Item
 */
export interface LTIContentItem {
  type: string;
  title: string;
  url: string;
  text?: string;
  icon?: string;
  thumbnail?: string;
  custom?: Record<string, string>;
}

/**
 * LTI Deep Linking Settings
 */
export interface LTIDeepLinkingSettings {
  deep_link_return_url: string;
  accept_types?: string[];
  accept_presentation_document_targets?: string[];
  accept_media_types?: string;
  accept_multiple?: boolean;
  auto_create?: boolean;
  title?: string;
  text?: string;
  data?: string;
}

/**
 * LTI JWT Claims
 */
export interface LTIJwtClaims {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  nonce?: string;
  'https://purl.imsglobal.org/spec/lti/claim/message_type': LTIMessageType;
  'https://purl.imsglobal.org/spec/lti/claim/version': string;
  'https://purl.imsglobal.org/spec/lti/claim/deployment_id': string;
  'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': string;
  'https://purl.imsglobal.org/spec/lti/claim/resource_link'?: {
    id: string;
    title?: string;
    description?: string;
  };
  'https://purl.imsglobal.org/spec/lti/claim/roles'?: string[];
  'https://purl.imsglobal.org/spec/lti/claim/context'?: {
    id: string;
    label?: string;
    title?: string;
    type?: string[];
  };
  'https://purl.imsglobal.org/spec/lti/claim/tool_platform'?: {
    guid?: string;
    name?: string;
    version?: string;
    product_family_code?: string;
  };
  'https://purl.imsglobal.org/spec/lti/claim/launch_presentation'?: {
    document_target?: string;
    height?: number;
    width?: number;
    return_url?: string;
    locale?: string;
  };
  'https://purl.imsglobal.org/spec/lti/claim/custom'?: Record<string, string>;
  'https://purl.imsglobal.org/spec/lti/claim/lis'?: {
    person_sourcedid?: string;
    course_offering_sourcedid?: string;
    course_section_sourcedid?: string;
  };
  'https://purl.imsglobal.org/spec/lti-nrps/claim/namesroleservice'?: {
    context_memberships_url: string;
    service_versions: string[];
  };
  'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint'?: {
    scope: string[];
    lineitem?: string;
    lineitems?: string;
  };
  'https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings'?: LTIDeepLinkingSettings;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  email?: string;
  locale?: string;
  picture?: string;
}
