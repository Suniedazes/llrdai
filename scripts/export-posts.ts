import {writeFile} from 'node:fs/promises';
import {postStore} from '../lib/post-store';
import {publicationSnapshot} from '../lib/publication';
async function main(){const posts=publicationSnapshot(await postStore.list());await writeFile('content/published-posts.json',JSON.stringify(posts,null,2)+'\n');console.log(`Exported ${posts.length} published posts; drafts and social captions excluded.`);}
void main();
