import { number } from "better-auth/*";

type IOption ={
    page?:string|number;
    limit?:string|number;
    sortOrder?:string;
    sortBy?:string;
}

type IOptionResult = {
    page:number,
    limit:number,
    skip:number,
    sortBy:string,
    sortOrder:string
}
const paginationSortingHelpres = (option:IOption):IOptionResult =>{
    const page:number = Number(option.page ?? 1);
    const limit:number = Number(option.limit ?? 5);
    const skip = (page - 1) * limit;

    const sortOrder:string = option.sortOrder || 'desc';
    const sortBy = option.sortBy || "createdAt"
    return{
        page,
        limit,
        skip,
        sortOrder,
        sortBy
    }
}

export default paginationSortingHelpres;