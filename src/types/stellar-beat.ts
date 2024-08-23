export type Network = {
  id: string;
  latestLedge: string;
  maxLedgerVersion: number;
  name: string;
  nodes: Node[];
  overlayMinVersion: number;
  overlayVersion: number;
  passPhrase: string;
  quorumSetConfiguration: BaseQuorumSet;
  stellarCoreVersion: string;
  time: string;
  transitiveQuorumSet: string[];
  scc: string[][];
};

export type BaseQuorumSet = {
  innerQuorumSets: Array<BaseQuorumSet>;
  threshold: number;
  validators: Array<string>;
};

export type Node = {
  active: boolean;
  activeInScp: boolean;
  alias?: string;
  connectivityError: boolean;
  dateDiscovered: Date;
  dateUpdated: Date;
  geoData: NodeGeoData;
  historyArchiveHasError: boolean;
  historyUrl?: string;
  homeDomain?: string;
  host?: string;
  index: number;
  ip: string;
  isFullValidator: boolean;
  isp: string;
  isValidating: boolean;
  lag?: number;
  ledgerVersion: number;
  name?: string;
  organizationId?: string;
  overlayMinVersion: number;
  overlayVersion: number;
  overLoaded: boolean;
  port: number;
  publicKey: string;
  quorumSet?: QuorumSet;
  quorumSetHashKey: string;
  statistics: NodeStatistics;
  stellarCoreVersionBehind: boolean;
  unknown: boolean;
  versionStr: string;
};

type NodeGeoData = {
  countryCode: string;
  countryName: string;
  latitude: number;
  longitude: number;
};

type NodeStatistics = {
  active24HoursPercentage: number;
  active30DaysPercentage: number;
  has24HourStats: boolean;
  has30DayStats: boolean;
  overLoaded24HoursPercentage: number;
  overLoaded30DaysPercentage: number;
  validating24HoursPercentage: number;
  validating30DaysPercentage: number;
};

export type QuorumSet = {
  innerQuorumSets: Array<QuorumSet>;
  threshold: number;
  validators: Array<string>;
};
