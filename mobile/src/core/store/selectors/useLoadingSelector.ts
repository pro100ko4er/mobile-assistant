import { useAppSelector } from "../hooks";

export default function useLoadingSelector() {
    return useAppSelector(state => state.LoadingReducer.loading)
}