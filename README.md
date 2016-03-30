##简单的字体服务
输入中文字符串和字体要求，返回图片，图片内容为输入的字符串

### 服务接口
#### GET /text

获取以图片方式表达的特定字体的字符串

输入：

    text: 输入文本 *
    family: 字体（0，1，2...）
    color: 颜色，white或者#ffffff
    size: 文字大小，以数字表示

输出：

正常返回：

    png二进制流
    
异常返回：

    400: There is something wrong with the params.

#### GET /font_families

获取可用字符串

输入：

输出：

    [
      {0: 'kaiti'},
      {1: 'simhei'},
      {2: 'song'},
      ...
    ]