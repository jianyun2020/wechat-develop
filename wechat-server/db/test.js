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
  }
  
}

let a = new InviteCodeUtil();

console.log(a.intMap.A)