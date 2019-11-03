export interface MessageData {
	error: errorMessage;
	success: any;
}

export interface errorMessage {
	title: string;
	description: string;
	buttons: { label: string; method: string }[];
	type: string
  }