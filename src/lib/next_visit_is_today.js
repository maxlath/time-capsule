import { get } from './day_end'

export default bookmark => bookmark && bookmark.nextVisit < get()
