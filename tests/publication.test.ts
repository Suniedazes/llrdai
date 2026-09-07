import test from 'node:test';
import assert from 'node:assert/strict';
import {publicationSnapshot} from '../lib/publication';
import type {Post} from '../lib/posts';
test('publication export excludes drafts and private studio metadata',()=>{const base:Post={id:'00000000-0000-4000-8000-000000000001',revision:1,slug:'public-update',title:'Public update',summary:'Summary',body:'Article',status:'PUBLISHED',createdAt:'2026-09-07',updatedAt:'2026-09-07',publishedAt:'2026-09-07',social:{facebook:'private copy',instagram:'private copy',tiktok:'private copy'}};const result=publicationSnapshot([base,{...base,status:'DRAFT',slug:'private-draft'}]);assert.equal(result.length,1);assert.equal('social' in result[0],false);assert.equal('revision' in result[0],false);assert.equal(result[0].slug,'public-update');});

