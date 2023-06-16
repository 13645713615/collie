/**
 * 上传文件
 * @param  {File} file
 */
export const upload = async (file: File) => request<string>("/file/upload", { isToken: true, body: objectToFormData({ file }), method: "POST" });
