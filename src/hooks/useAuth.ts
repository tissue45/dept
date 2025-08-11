import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "../api/supabaseClient";

export function useAuth() {
    // 초기값 null 세팅
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // 1. 초기 사용자 정보 비동기 호출
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        // 2. 인증 상태 변화 구독
        const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        // 구독 해제 함수 리턴
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signInWithEmail = (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password });

    const signUpWithEmail = (email: string, password: string) =>
        supabase.auth.signUp({ email, password });

    const signOut = () => supabase.auth.signOut();

    return { user, signInWithEmail, signUpWithEmail, signOut };
}