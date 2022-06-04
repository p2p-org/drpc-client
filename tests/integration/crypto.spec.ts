import { checkSha256 } from '../../src/isocrypto/signatures';
import KEYS from '../../src/keys';
import { sha256 } from '../../src/isocrypto/hashes';
import {
  arrayBufferToHex,
  hexToArrayBuffer,
  stringToArrayBuffer,
  arrayBufferToString,
  getcrypto,
} from '../../src/isocrypto/util';

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
let privKey: CryptoKey;

beforeAll(async () => {
  const crypto = await getcrypto();
  privKey = await crypto.subtle.importKey(
    'pkcs8',
    hexToArrayBuffer(
      '308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104206f8bbec4107314a62b04654acc2202bd4e7099c0b29df89a91110d66b6b73b36a14403420004b90fb62312ffdc6586d94736fb31abbb5fc1c2bcd26191417a2ca48657651b6c360d783f15a76d02a079934ae38e16e93e248fa9a5634488b0ddcd73a5bbdf3f'
    ),
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['sign']
  );
});

describe('isocrypto', () => {
  it('creates sha256', async () => {
    let result = await sha256('mytest');
    expect(result).toEqual(
      'f68d27da17d9fd49440b0b8dac130f4f98a2d4c6aca3c9221cdbc8b264b2c8be'
    );
  });

  it('converts hex to array buffer', () => {
    expect(
      arrayBufferToString(
        hexToArrayBuffer(arrayBufferToHex(stringToArrayBuffer('hello')))
      )
    ).toEqual('hello');
  });

  it('checks sha256 ecdsa signature', async () => {
    const crypto = await getcrypto();
    const data =
      'DSHACKLESIG/100/test-2/f3ddd3ab6a547869e61881e6ef94c780e2f201f7f0c45f589344f4749c426846';
    const sig = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256',
      },
      privKey,
      stringToArrayBuffer(data)
    );
    expect(
      await checkSha256(data, arrayBufferToHex(sig), KEYS['test'])
    ).toBeTruthy();
  });
});
