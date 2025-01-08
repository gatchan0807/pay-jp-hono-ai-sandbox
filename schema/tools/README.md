# 動作確認

ローカル環境でDB（D1）にデータが入ったかの確認は以下のコマンドで行うことができます。

```bash
$ sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/[ファイル名].sqlite
```

上記のコマンドを実行すると、sqlite3のCLIが起動します。以下のコマンドでデータを確認することができます。

```sql
sqlite> .tables
sqlite> SELECT * FROM [テーブル名];
```

Dev / Prd環境での確認はCloudflareのコンソールから行ってください。