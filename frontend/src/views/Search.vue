<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../utils/api';
import { ArrowLeft, Loader2, Frown, CalendarDays, Search as SearchIcon } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const results = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref((route.query.q as string) || '');

const handleSearch = () => {
  const q = searchQuery.value.trim();
  if (q) {
    router.replace({ path: '/search', query: { q } });
  } else {
    router.replace({ path: '/search' });
  }
};

const fetchResults = async (q: string) => {
  if (!q) {
    results.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await api.get('/diaries/search', { params: { q } });
    results.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(() => route.query.q, (newQ) => {
  searchQuery.value = (newQ as string) || '';
  fetchResults(newQ as string);
});

onMounted(() => {
  fetchResults(route.query.q as string);
});

// 纯文本摘要提取，并简易标注高亮
const getPreview = (content: string, q: string) => {
  if (!content) return '';
  let stripped = content.replace(/[#*`_>\[\]]/g, '').slice(0, 150) + '...';
  if (!q) return stripped;
  
  // 安全地利用正则分割，防被注入
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return stripped.replace(regex, '<span class="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded font-medium">$1</span>');
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-4 animate-[fadeIn_0.4s_ease]">
    <div class="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <button @click="router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors tooltip relative shrink-0">
        <ArrowLeft class="w-5 h-5 text-slate-600" />
      </button>

      <div class="flex-1 bg-slate-50 flex items-center px-4 py-2.5 rounded-xl border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
        <SearchIcon class="w-5 h-5 text-slate-400 mr-3 shrink-0" />
        <input 
          type="text" 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
          placeholder="搜索日记..." 
          class="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 font-medium" 
        />
      </div>

      <span class="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap shrink-0 hidden sm:block">
        共 {{ results.length }} 条
      </span>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20 space-y-4">
      <Loader2 class="w-10 h-10 animate-spin text-indigo-500" />
      <span class="text-slate-400 font-medium">翻阅记忆中...</span>
    </div>
    
    <!-- 提示输入状态 -->
    <div v-else-if="!route.query.q" class="text-center py-24 flex flex-col items-center text-slate-500">
      <SearchIcon class="w-16 h-16 mb-4 text-slate-300" />
      <p class="text-xl font-bold text-slate-400">检索日志</p>
      <p class="text-sm mt-2 text-slate-400">输入关键字开始回忆</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="results.length === 0" class="text-center py-24 flex flex-col items-center text-slate-500">
      <Frown class="w-16 h-16 mb-4 text-slate-300" />
      <p class="text-xl font-bold text-slate-400">检索一无所获</p>
      <p class="text-sm mt-2 text-slate-400">换个不同的关键字寻找回忆吧</p>
    </div>

    <!-- 检索结果流 -->
    <div v-else class="space-y-5">
      <div v-for="diary in results" :key="diary.id" 
        @click="router.push(`/editor/${diary.date}`)"
        class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg hover:shadow-indigo-100/50 hover:border-indigo-200 hover:-translate-y-1 transition-all group">
        
        <div class="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
          <div class="flex items-center gap-4">
            <span class="text-3xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-indigo-50 transition-colors shadow-inner">{{ diary.mood_emoji }}</span>
            <div class="flex flex-col">
              <span class="text-xs font-semibold tracking-wider text-slate-400 uppercase">日期</span>
              <span class="font-extrabold text-xl text-slate-700 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                {{ diary.date }}
              </span>
            </div>
          </div>
          <CalendarDays class="w-5 h-5 text-slate-200 group-hover:text-indigo-300 transition-colors" />
        </div>
        
        <p class="text-slate-600 leading-relaxed text-[15px] break-words line-clamp-3" v-html="getPreview(diary.content, route.query.q as string)"></p>
      </div>
    </div>
  </div>
</template>
