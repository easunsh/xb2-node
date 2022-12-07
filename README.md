# 依桑的国度

# -生成密钥文件 private.key 文件---

# 项目中根目录新建 config 目录

# 进入 config 目录，命令行输入 openssl

# 进入 ssl 模式

# 再输入 genrsa -out private.key 4096 (4096 位)

# ---基于这个密钥文件再生成一个公钥 文件 public.key ---

# rsa -in private.key -pubout -out public.key

# 然后 exit 退出 ssl 模式
