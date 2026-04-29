import type { ReleaseInfo as NipawReleaseInfo } from 'nipaw'

export interface ReleaseInfo extends NipawReleaseInfo {
	owner: string
	repo: string
}
