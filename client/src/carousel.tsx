import { useEffect, useRef, useState } from "react"
import { ICardsProps } from "./collection"
import { Loading } from "./loading"

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'


interface CarouselProps {
    /**
     * An array of cards.
     */
    data: ICardsProps[]

    /**
     * Current index.
     */
    currentCardIndex: number

    /**
     * Set new index.
     */
    setCurrentCardIndex: (index: number) => void

    /**
     * Handle open/close modal.
     */
    setModal: (value: boolean) => void
}

export const Carousel = ({ data, currentCardIndex, setCurrentCardIndex, setModal }: CarouselProps) => {

    /**
     * Initialize the slide array.
     * 
     * @return {string[]}
     */
    const initializeSlides = (): string[] => {
        let modalSlides: string[] = []

        if (currentCardIndex === data.length - 1) modalSlides = [data[data.length - 2].thumbnail, data[currentCardIndex].thumbnail, data[0].thumbnail]
        else if (currentCardIndex === 0) modalSlides = [data[data.length - 1].thumbnail, data[currentCardIndex].thumbnail, data[1].thumbnail]
        else modalSlides = [data[currentCardIndex - 1].thumbnail, data[currentCardIndex].thumbnail, data[currentCardIndex + 1].thumbnail]
        return modalSlides
    }

    /**
     * Reajust the slide array.
     */
    const transitionSmooth = () => {
        let newModalsSlides: string[] = []

        if (currentCardIndex === data.length - 1) newModalsSlides = [data[data.length - 2].thumbnail, data[currentCardIndex].thumbnail, data[0].thumbnail]
        else if (currentCardIndex === 0) newModalsSlides = [data[data.length - 1].thumbnail, data[currentCardIndex].thumbnail, data[1].thumbnail]
        else newModalsSlides = [data[currentCardIndex - 1].thumbnail, data[currentCardIndex].thumbnail, data[currentCardIndex + 1].thumbnail]

        setCardsModalSlides(newModalsSlides)
        setTransform({ ...transform, translate: 0, transition: 0, transitioning: true })
    }

    const carouselRef = useRef<HTMLDivElement>(null);
    const slidesRef = useRef<HTMLDivElement[]>([]);
    const windowRef = useRef(window.innerWidth)
    const countCarouselRef = useRef(0)
    const countModalRef = useRef(0)

    const [transform, setTransform] = useState({ transition: 0.75, translate: 0, transitioning: false })
    const [isLoadingPreview, setIsLoadingPreview] = useState(true)
    const [isLoadingCarouselImages, setIsLoadingCarouselImages] = useState(true)


    const [cardsModalSlides, setCardsModalSlides] = useState<string[]>(initializeSlides)

    useEffect(() => {
        const handleResize = () => {
            windowRef.current = window.innerWidth
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

        }
    }, [])

    useEffect(() => {
        const { transition } = transform
        if (transition === 0) {
            setTimeout(() => { setTransform({ ...transform, transition: 0.75, transitioning: false }) }, 50)
        }
    }, [transform.transition])

    useEffect(() => {
        const carousel = carouselRef.current;
        const slide = slidesRef.current[currentCardIndex];
        const middleScreen = window!.innerWidth / 2;
        const middleIndex = Math.floor(middleScreen / slide!.offsetWidth)
        const numberElementsPerPages = carousel!.offsetWidth / slide!.offsetWidth
        const totalSections = data.length / numberElementsPerPages
        let section = 0
        for (let i = 1; i < totalSections + 1; i++) { if (currentCardIndex >= numberElementsPerPages * i) section++; }
        if (currentCardIndex >= middleIndex && currentCardIndex <= data.length - 1 - middleIndex) {
            carousel!.scrollLeft = slide!.offsetLeft + slide!.offsetWidth / 2 - middleScreen;
        }
        else {
            carousel!.scrollLeft = carousel!.offsetWidth * section
        }
    }, [])

    /**
     * Handle image loading for the carousel. Wait for all images to load before displaying them.
     */
    const handleLoadingCarouselImages = () => {
        countCarouselRef.current += 1;
        if (countCarouselRef.current >= data.length) {
            setIsLoadingCarouselImages(false);
        }
    }

    /**
     * Handle image loading for the preview. Wait for all images to load before displaying them.
     */
    const handleLoadingPreview = () => {
        countModalRef.current += 1;
        if (countModalRef.current >= cardsModalSlides.length) {
            setIsLoadingPreview(false);
        }

    }

    /**
     * Get the previous slide.
     */
    const previousSlide = () => {
        if (transform.transitioning) return
        let newCardIndex = 0
        const carousel = carouselRef.current
        const middleScreen = window!.innerWidth / 2;
        let { translate } = transform

        if (currentCardIndex > 0) {
            newCardIndex = currentCardIndex - 1
            const slide = slidesRef.current[newCardIndex];
            const middleIndex = Math.floor(middleScreen / slide!.offsetWidth)

            if (newCardIndex >= middleIndex - 1 && newCardIndex <= data.length - middleIndex) {
                carousel!.scrollLeft = slide!.offsetLeft + slide!.offsetWidth / 2 - middleScreen;
            }
        }
        else {
            newCardIndex = data.length - 1
            carousel!.scrollLeft = carousel!.scrollWidth
        }

        translate += windowRef.current

        setTransform({ ...transform, translate: translate })
        setCurrentCardIndex(newCardIndex)
    }

    /**
     * Get the next slide.
     */
    const nextSlide = () => {
        if (transform.transitioning) return
        let newCardIndex = 0
        const carousel = carouselRef.current;
        const middleScreen = window!.innerWidth / 2;
        let { translate } = transform


        if (currentCardIndex < data.length - 1) {

            newCardIndex = currentCardIndex + 1
            const slide = slidesRef.current[newCardIndex];
            const middleIndex = Math.floor(middleScreen / slide!.offsetWidth)

            if (newCardIndex >= middleIndex && newCardIndex <= data.length - middleIndex) {
                carousel!.scrollLeft = slide!.offsetLeft + slide!.offsetWidth / 2 - middleScreen;
            }
        }
        else {
            newCardIndex = 0
            carousel!.scrollLeft = 0
        }
        translate -= window.innerWidth

        setTransform({ ...transform, translate: translate })
        setCurrentCardIndex(newCardIndex)
    }

    /**
     * Handle click on a preview.
     * 
     * @param {number} index - number representing the index of the clicked card
     */
    const handleClickPreview = (index: number) => {
        const carousel = carouselRef.current
        const middleScreen = window!.innerWidth / 2;
        const slide = slidesRef.current[index];
        const middleIndex = Math.floor(middleScreen / slide!.offsetWidth)
        const numberElementsPerPages = carousel!.offsetWidth / slide!.offsetWidth
        const totalSections = data.length / numberElementsPerPages
        let section = 0
        let newModalsSlides = []

        for (let i = 1; i < totalSections + 1; i++) { if (index >= numberElementsPerPages * i) section++; }

        if (index >= middleIndex - 1 && index <= data.length - middleIndex) {
            carousel!.scrollLeft = slide!.offsetLeft + slide!.offsetWidth / 2 - middleScreen;
        } else {
            carousel!.scrollLeft = carousel!.offsetWidth * section
        }

        if (index === 0) {
            newModalsSlides = [data[data.length - 1].thumbnail, data[index].thumbnail, data[index + 1].thumbnail]
        }
        else if (index === data.length - 1) {
            newModalsSlides = [data[index - 1].thumbnail, data[index].thumbnail, data[0].thumbnail]
        }
        else {
            newModalsSlides = [data[index - 1].thumbnail, data[index].thumbnail, data[index + 1].thumbnail]
        }
        setCardsModalSlides(newModalsSlides)
        setCurrentCardIndex(index)
    }

    return (<>
        <div className='card-modal'>
            <Loading isLoading={isLoadingPreview}
                borderColor='transparent'
                keyIndex={currentCardIndex} />
            <div className='card-modal__images-box'
                style={{
                    transform: `translate3d(${transform.translate}px, 0, 0)`,
                    transition: `transform ease-in-out ${transform.transition}s`,
                    display: isLoadingPreview ? 'none' : 'flex'
                }}
                onTransitionEnd={transitionSmooth}>
                {cardsModalSlides.map((object, currentCardIndex) => {
                    return (
                        <div key={`card-modal__images-box__image-div-${currentCardIndex}`}
                            className={`card-modal__images-box__image-div ${currentCardIndex}`}
                            style={{
                                width: `${window}px`
                            }}
                            data-index={currentCardIndex + 1}
                            aria-labelledby={`card-modal__image-box-${currentCardIndex + 1}`}>
                            <img src={object}
                                alt={`card modal ${currentCardIndex}`}
                                className={`card-modal__images-box__card-modal-image`}
                                aria-hidden={currentCardIndex === 1 ? false : true}
                                key={`modal_image_slide_${currentCardIndex}`}
                                onLoad={handleLoadingPreview}
                            />
                        </div>

                    )
                })}
            </div>
            <RxCross2 className='modal__cross_close' onClick={() => setModal(false)} aria-label="Close Image Preview" />
        </div>
        <div className="carousel-container">
            <div className="carousel-container__left-arrow-container"
                onClick={previousSlide}
                aria-label="View Previous Image">
                <IoIosArrowBack />
            </div>
            <div className="carousel-container__slides" ref={carouselRef}>
                {data.map((object, index) => {
                    return (<div className="carousel-container__slides__preview"
                        key={`slide__preview-${object.name}`}
                        onClick={() => handleClickPreview(index)}
                        ref={slide => slidesRef.current[index] = slide as HTMLInputElement}
                        aria-label={`View Image ${index + 1}`}>
                        <Loading isLoading={isLoadingCarouselImages}
                            borderColor='transparent'
                            keyIndex={currentCardIndex}
                        />
                        <img src={object.thumbnail}
                            alt={`preview ${object.name}`}
                            key={`image-${object.name}`}
                            onLoad={handleLoadingCarouselImages}
                            style={{ display: isLoadingCarouselImages ? 'none' : 'block' }} />
                    </div>
                    )
                })}
            </div>
            <div className="carousel-container__right-arrow-container"
                onClick={nextSlide}
                aria-label="View Next Image">
                <IoIosArrowForward />
            </div>
        </div>
    </>
    )
}