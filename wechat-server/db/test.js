const openid = 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M';

class InviteCodeUtil {
  offset = 24;
  stopChar = 'Z';
  minCodeLen = 4;
  
  codeMap = {
    0:"A",
    1:"B",
    2:"C",
    3:"D",
    4:"E",
    5:"F",
    6:"G",
    7:"H",
    8:"I",
    9:"J",
    10:"K",
    11:"L",
    12:"M",
    13:"N",
    14:"P",
    15:"Q",
    16:"R",
    17:"S",
    18:"T",
    19:"U",
    20:"V",
    21:"W",
    22:"X",
    23:"Y"
  }

  intMap = {
    A:0,
    B:1,
    C:2,
    D:3,
    E:4,
    F:5,
    G:6,
    H:7,
    I:8,
    J:9,
    K:10,
    L:11,
    M:12,
    N:13,
    P:14,
    Q:15,
    R:16,
    S:17,
    T:18,
    U:19,
    V:20,
    W:21,
    X:22,
    Y:23,
  }

  // 根据id生成6位邀请码
  createCode(id) {
    let code = this.int2chars(id);
    if (code.length < (this.minCodeLen-1)) {
      code = code + this.stopChar + this.codeTail(code)
    } else if (code.length < this.minCodeLen) {
      code = code + this.stopChar
    }
    return code
  }

  codeTail (code) {
    let res = "";
    let lastChar = code.substring(code.length-1, code.length);
    for (let i = 0; i < (this.minCodeLen-1-code.length); i++){
      res += lastChar;
    
    }
    return res
  }

  

  int2chars(id) {
    const div = Math.floor(id / this.offset);
    const remainder = id % this.offset;

    if (div === 0) {
      return this.codeMap[id];
    } else if (div < this.offset) {
      return this.codeMap[div] + this.codeMap[remainder];
    } else {
      return this.int2chars(div) + this.codeMap[remainder];
    }
  }

}

let a = new InviteCodeUtil();

console.log(a.createCode(12313))