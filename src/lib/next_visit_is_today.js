import { get } from './day_end.js'

export const nextVisitIsToday = bookmark => bookmark && bookmark.nextVisit < get()

