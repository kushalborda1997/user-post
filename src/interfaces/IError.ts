export default interface IError {
    status: number,
    message?: string,
    stack?: string,
    errors?: string,
    isPublic?: boolean,
}